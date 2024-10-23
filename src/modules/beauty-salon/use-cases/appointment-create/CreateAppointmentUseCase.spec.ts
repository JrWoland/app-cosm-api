// src/modules/beauty-salon/use-cases/appointment-create/CreateAppointmentUseCase.spec.ts
import { Test, TestingModule } from '@nestjs/testing';

import { CreateAppointmentUseCase } from './CreateAppointmentUseCase';
import { AppointmentRepository } from 'src/modules/beauty-salon/repos/Appointment.repository';
import { TreatmentRepository } from 'src/modules/beauty-salon/repos/Treatment.repository';
import { ClientRepository } from 'src/modules/beauty-salon/repos/Client.repository';
import { CreateAppointmentCommand } from './CreateAppointmentCommand';
import { NotFoundException } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { ClientId } from 'src/modules/beauty-salon/domain/client/ClientId';
import { TreatmentId } from 'src/modules/beauty-salon/domain/treatment/TreatmentId';
import { Client } from 'src/modules/beauty-salon/domain/client/Client';
import { ClientName } from 'src/modules/beauty-salon/domain/client/ClientName';
import { ClientSurname } from 'src/modules/beauty-salon/domain/client/ClientSurname';
import { ClientStatus } from 'src/modules/beauty-salon/domain/client/ClientStatus';
import { ClientBirthDay } from 'src/modules/beauty-salon/domain/client/ClientBirthDay';
import { ClientPhoneNumber } from 'src/modules/beauty-salon/domain/client/ClientPhone';
import { ClientEmail } from 'src/modules/beauty-salon/domain/client/ClientEmail';
import { TreatmentName } from 'src/modules/beauty-salon/domain/treatment/TreatmentName';
import { Treatment } from 'src/modules/beauty-salon/domain/treatment/Treatment';
import { TreatmentDuration } from 'src/modules/beauty-salon/domain/treatment/TreatmentDuration';
import { TreatmentPrice } from 'src/modules/beauty-salon/domain/treatment/TreatmentPrice';
import { CardId } from 'src/modules/beauty-salon/domain/card/CardId';

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;
  let appointmentRepository: jest.Mocked<AppointmentRepository>;
  let treatmentRepository: jest.Mocked<TreatmentRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let client: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentUseCase,
        {
          provide: AppointmentRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: TreatmentRepository,
          useValue: {
            findTreatmentsByIds: jest.fn(),
          },
        },
        {
          provide: ClientRepository,
          useValue: {
            findClientById: jest.fn(),
          },
        },
      ],
    }).compile();

    client = Client.create({
      id: ClientId.create(new UniqueEntityID('client-id')),
      name: ClientName.create('John'),
      surname: ClientSurname.create('Doe'),
      accountId: AccountId.create(new UniqueEntityID('account-id')),
      status: ClientStatus.create('ACTIVE'),
      birthDay: ClientBirthDay.create('2001-01-01'),
      phone: ClientPhoneNumber.create('+123456789'),
      email: ClientEmail.create('test@test.com'),
    });

    useCase = module.get<CreateAppointmentUseCase>(CreateAppointmentUseCase);
    appointmentRepository = module.get<AppointmentRepository, jest.Mocked<AppointmentRepository>>(AppointmentRepository);
    treatmentRepository = module.get<TreatmentRepository, jest.Mocked<TreatmentRepository>>(TreatmentRepository);
    clientRepository = module.get<ClientRepository, jest.Mocked<ClientRepository>>(ClientRepository);
  });

  it('should create an appointment successfully', async () => {
    const command: CreateAppointmentCommand = {
      accountId: 'account-id',
      clientId: 'client-id',
      date: '2023-10-10',
      startTime: 600,
      status: 'NEW',
      treatments: [
        { id: 'treatment-id-1', duration: 30, startTime: 600 },
        { id: 'treatment-id-2', duration: 60, startTime: 630 },
      ],
    };

    const treatmentsIds = command.treatments.map((item) => TreatmentId.create(new UniqueEntityID(item.id)));

    treatmentRepository.findTreatmentsByIds.mockResolvedValue([
      Treatment.create({
        id: treatmentsIds[0],
        name: TreatmentName.create('Treatment 1'),
        duration: TreatmentDuration.create(30),
        price: TreatmentPrice.create(100),
        defaultCardId: CardId.create(new UniqueEntityID('card-id')),
        accountId: AccountId.create(new UniqueEntityID('account-id')),
      }),
      Treatment.create({
        id: treatmentsIds[1],
        name: TreatmentName.create('Treatment 2'),
        duration: TreatmentDuration.create(30),
        price: TreatmentPrice.create(100),
        defaultCardId: CardId.create(new UniqueEntityID('card-id')),
        accountId: AccountId.create(new UniqueEntityID('account-id')),
      }),
    ]);

    clientRepository.findClientById.mockResolvedValue(client);

    const result = await useCase.execute(command);

    expect(result).toEqual({ message: 'Appointment created', id: expect.any(String), success: true });
    expect(appointmentRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if client does not exist', async () => {
    const command: CreateAppointmentCommand = {
      accountId: 'account-id',
      clientId: 'client-id',
      date: '2023-10-10',
      startTime: 600,
      status: 'NEW',
      treatments: [
        { id: 'treatment-id-1', duration: 30, startTime: 600 },
        { id: 'treatment-id-2', duration: 60, startTime: 630 },
      ],
    };

    clientRepository.findClientById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if treatments are missing', async () => {
    const command: CreateAppointmentCommand = {
      accountId: 'account-id',
      clientId: 'client-id',
      date: '2023-10-10',
      startTime: 600,
      status: 'NEW',
      treatments: [
        { id: 'treatment-id-1', duration: 30, startTime: 600 },
        { id: 'treatment-id-2', duration: 60, startTime: 630 },
      ],
    };

    const treatmentsIds = command.treatments.map((item) => TreatmentId.create(new UniqueEntityID(item.id)));

    treatmentRepository.findTreatmentsByIds.mockResolvedValue([
      Treatment.create({
        id: treatmentsIds[0],
        name: TreatmentName.create('Treatment 1'),
        duration: TreatmentDuration.create(30),
        price: TreatmentPrice.create(100),
        defaultCardId: CardId.create(new UniqueEntityID('card-id')),
        accountId: AccountId.create(new UniqueEntityID('account-id')),
      }),
    ]);

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
  });
});
