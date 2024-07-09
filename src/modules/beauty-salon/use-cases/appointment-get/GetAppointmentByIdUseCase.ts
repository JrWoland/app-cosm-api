import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAppointmentByIdQuery } from './GetAppointmentByIdQuery';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { AppointmentRepository } from '../../repos/Appointment.repository';
import { AppointmentId } from '../../domain/appointment/AppointmentId';

interface ResponseResult {
  id: string;
  client: {
    id: string;
    name: string;
    surname: string;
  };
  date: string;
  startTime: number;
  status: string;
  treatments: {
    id: string;
    name: string;
    startTime: number;
    duration: number;
  }[];
}

@QueryHandler(GetAppointmentByIdQuery)
export class GetAppointmentByIdUseCase implements IQueryHandler<GetAppointmentByIdQuery> {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: GetAppointmentByIdQuery): Promise<ResponseResult> {
    const accountID = AccountId.create(new UniqueEntityID(query.accountId));
    const appointmentID = AppointmentId.create(new UniqueEntityID(query.appointmentId));

    const appointment = await this.appointmentRepository.findAppointmentById(appointmentID, accountID);

    return {
      id: appointment.id.value,
      client: {
        id: appointment.client.value.id.value,
        name: appointment.client.value.name,
        surname: appointment.client.value.surname,
      },
      date: appointment.date.value.toISOString(),
      startTime: appointment.startTime.value,
      status: appointment.status.value,
      treatments: appointment.treatments.map((item) => ({
        id: item.treatmentId.value,
        name: item.name,
        duration: item.duration,
        startTime: item.startTime,
      })),
    };
  }
}
