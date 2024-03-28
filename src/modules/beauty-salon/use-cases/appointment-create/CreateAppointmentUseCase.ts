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
import { AppointmentTreatment } from '../../domain/appointment/AppointmentTreatment';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { TreatmentRepository } from '../../repos/Treatment.repository';
import { UnprocessableEntityException } from '@nestjs/common';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentUseCase implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly treatmentRepository: TreatmentRepository,
  ) {}

  private checkMissingTreatments(treatmentsIds: TreatmentId[], actualIds: TreatmentId[]) {
    const resultIds = actualIds.map((item) => item.value);
    const missingTreatments = treatmentsIds.filter((id) => !resultIds.includes(id.value));

    if (missingTreatments.length > 0) {
      throw new UnprocessableEntityException({
        description: `Cannot find treatments of id: ${JSON.stringify(missingTreatments.map((id) => id.value).join(','))}`,
      });
    }
  }

  async execute(command: CreateAppointmentCommand): Promise<{ message: string; id: string; success: boolean }> {
    // TODO clientId should belong to account
    const { accountId, clientId, date, startTime, status, treatments } = command;

    const accId = AccountId.create(new UniqueEntityID(accountId));

    const treatmentsIds = treatments.map((item) => TreatmentId.create(new UniqueEntityID(item.id)));

    const appointmentTreatments = await this.treatmentRepository.findTreatmentsByIds(treatmentsIds, accId);

    this.checkMissingTreatments(
      treatmentsIds,
      appointmentTreatments.map((item) => item.id),
    );

    const treatmentsToSave = treatments.map(({ duration, startTime, id }) => {
      const treatment = appointmentTreatments.find((item) => id === item.id.value);

      if (!treatment) {
        throw new UnprocessableEntityException({ description: `Cannot find treatment id: ${id}.` });
      }

      return AppointmentTreatment.create({
        name: treatment.name.value,
        duration,
        startTime,
        treatmentId: TreatmentId.create(new UniqueEntityID(id)),
      });
    });

    const appointment = Appointment.create({
      id: AppointmentId.create(),
      accountId: accId,
      clientId: ClientId.create(new UniqueEntityID(clientId)),
      date: AppointmentDate.create(date),
      startTime: AppointmentStartTime.create(startTime),
      status: AppointmentStatus.isStatusValid(status) ? AppointmentStatus.create(status) : AppointmentStatus.create('NEW'),
      services: treatmentsToSave,
    });

    await this.appointmentRepository.save(appointment);

    return { message: 'Appointment created', id: appointment.id.value, success: true };
  }
}
