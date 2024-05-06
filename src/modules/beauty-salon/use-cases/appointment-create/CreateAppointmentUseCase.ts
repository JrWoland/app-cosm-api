import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from './CreateAppointmentCommand';
import { Appointment } from '../../domain/appointment/Appointment';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { ClientId } from '../../domain/client/ClientId';
import { AppointmentDate } from '../../domain/appointment/AppointmentDate';
import { AppointmentStartTime } from '../../domain/appointment/AppointmentStartTime';
import { AppointmentStatus } from '../../domain/appointment/AppointmentStatus';
import { AppointmentRepository } from '../../repos/Appointment.repository';
import { AppointmentId } from '../../domain/appointment/AppointmentId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AppointmentTreatment } from '../../domain/appointment/AppointmentTreatmentDetails';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { TreatmentRepository } from '../../repos/Treatment.repository';
import { NotFoundException } from '@nestjs/common';
import { ClientRepository } from '../../repos/Client.repository';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentUseCase implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly treatmentRepository: TreatmentRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  private checkMissingTreatments(treatmentsIds: TreatmentId[], actualIds: TreatmentId[]) {
    const resultIds = actualIds.map((item) => item.value);
    const missingTreatments = treatmentsIds.filter((id) => !resultIds.includes(id.value));

    if (missingTreatments.length > 0) {
      throw new NotFoundException(`Cannot find treatments of id: ${JSON.stringify(missingTreatments.map((id) => id.value).join(','))}`);
    }
  }

  async execute(command: CreateAppointmentCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, clientId, date, startTime, status, treatments } = command;

    const accountID = AccountId.create(new UniqueEntityID(accountId));
    const clientID = ClientId.create(new UniqueEntityID(clientId));

    const treatmentsIds = treatments.map((item) => TreatmentId.create(new UniqueEntityID(item.id)));

    const appointmentTreatments = await this.treatmentRepository.findTreatmentsByIds(treatmentsIds, accountID);

    this.checkMissingTreatments(
      treatmentsIds,
      appointmentTreatments.map((item) => item.id),
    );

    const exists = await this.clientRepository.exist(clientID, accountID);

    if (!exists) {
      throw new NotFoundException(`Client does not exist. id: ${clientID.value}`);
    }

    const treatmentsToSave = treatments.map(({ duration, startTime, id }) => {
      const treatment = appointmentTreatments.find((item) => id === item.id.value);

      if (!treatment) {
        throw new NotFoundException(`Cannot find treatment id: ${id}.`);
      }

      return AppointmentTreatment.create({
        name: treatment.name.value,
        duration,
        startTime,
        treatmentId: TreatmentId.create(new UniqueEntityID(id)),
      });
    });

    const appointment = Appointment.create({
      id: AppointmentId.create(new UniqueEntityID()),
      accountId: accountID,
      clientId: clientID,
      date: AppointmentDate.create(date),
      startTime: AppointmentStartTime.create(startTime),
      status: AppointmentStatus.isStatusValid(status) ? AppointmentStatus.create(status) : AppointmentStatus.create('NEW'),
      services: treatmentsToSave,
    });

    await this.appointmentRepository.save(appointment);

    return { message: 'Appointment created', id: appointment.id.value, success: true };
  }
}
