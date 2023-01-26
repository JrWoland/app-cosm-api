import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { AccountId } from '../../../accounts/domain/AccountId';
import { AppoinmentRepository } from '../../repo';

interface TreatmentDTO {
  id: string;
  name: string;
  startTime?: number | null;
  duration?: number | null;
}

interface ResponseAppointmentDTO {
  id: string;
  clientId: string | null;
  date: Date;
  status: string;
  duration: number;
  startTime: number;
  treatments: TreatmentDTO[];
}

interface AppointmentsResponse {
  count: number;
  totalPages: number;
  currentPage: number;
  appointments: ResponseAppointmentDTO[];
}

export class GetAppointmentsListController extends BaseController {
  public async executeImpl(req: DecodedExpressReq) {
    try {
      const accId = AccountId.create(new UniqueEntityID(req.accountId));

      const { page = 1, limit = 10, status = '', dateFrom = '', dateTo = '', clientId = '', beautyServiceId = '' } = req.query;

      const queryFilters = {
        page: Number(page || 1),
        limit: Number(limit || 10),
        satus: String(status || '').toUpperCase(),
        dateFrom: String(dateFrom || ''),
        dateTo: String(dateTo || ''),
        clientId: String(clientId || ''),
        beautyServiceId: String(beautyServiceId || ''),
      };
      const { appointments, count } = await AppoinmentRepository.findAllAppoinmentsList(accId.getValue(), queryFilters);

      const appoinmentsList: ResponseAppointmentDTO[] = appointments.map((appointment) => ({
        id: appointment.appointmentId.value,
        clientId: appointment.clientId?.value || null,
        date: appointment.date,
        status: appointment.status,
        duration: appointment.duration,
        startTime: appointment.startTime,
        treatments: appointment.treatments.list.map((treatment) => ({
          id: treatment.treatmentId.value,
          name: treatment.name,
          startTime: treatment?.startTime || null,
          duration: treatment?.duration || null,
        })),
      }));

      return this.ok<AppointmentsResponse>(this.res, {
        ...this.pagination({ count: count, limit: queryFilters.limit, page: queryFilters.page }),
        appointments: appoinmentsList || [],
      });
    } catch (error) {
      return this.fail(error.message);
    }
  }
}
