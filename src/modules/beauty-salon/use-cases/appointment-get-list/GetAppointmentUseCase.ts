import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from '../../repos/Appointment.repository';
import { GetAppointmentQuery } from './GetAppointmentQuery';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';

type TreatmentType = {
  treatmentId: string;
  name: string;
  duration: number;
  startTime: number;
};
type ResponseResult = {
  count: number;
  limit: number;
  page: number;
  appointments: {
    id: string;
    clientId: string;
    date: string;
    status: 'CLIENT_NOT_APPEARD' | 'DECLINED' | 'FINISHED' | 'NEW';
    duration: number;
    startTime: number;
    treatments: TreatmentType[];
  }[];
};

@QueryHandler(GetAppointmentQuery)
export class GetAppointmentUseCase implements IQueryHandler<GetAppointmentQuery> {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(query: GetAppointmentQuery): Promise<ResponseResult> {
    const accId = AccountId.create(new UniqueEntityID(query.accountId));

    const { page = 1, limit = 10, status = '', dateFrom = '', dateTo = '', clientId = '', beautyServiceId = '' } = query;

    const { appointments, count } = await this.repository.findAllAppoinmentsList(accId, {
      page,
      limit,
      status,
      dateFrom,
      dateTo,
      clientId,
      beautyServiceId,
    });

    const appoinmentsList = appointments.map((appointment) => ({
      id: appointment.id.value,
      clientId: appointment.clientId.value,
      date: appointment.date.value.toISOString(),
      status: appointment.status.value,
      duration: appointment.duration.value,
      startTime: appointment.startTime.value,
      treatments: appointment.treatments.map(({ duration, name, startTime, treatmentId }) => ({
        duration,
        name,
        startTime,
        treatmentId: treatmentId.value,
      })),
    }));

    return {
      count,
      limit,
      page,
      appointments: appoinmentsList || [],
    };
  }
}
