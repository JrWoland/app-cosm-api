import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { AccountId } from '../../../accounts/domain/AccountId';
import { AppointmentId } from '../../domain/AppointmentId';
import { Treatment } from '../../domain/Treatment';
import { Treatments } from '../../domain/Treatments';
import { AppoinmentRepository } from '../../repo';

interface FilledCardDTO {
  name?: string;
  treatmentCardId?: string;
  template?: any;
}

interface TreatmentDTO {
  id: string;
  name: string;
  startTime: number | null;
  duration: number | null;
  price: number | null;
  notes: string | null;
  assingedCardId: string | null;
  filledCard?: FilledCardDTO | null;
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

export class GetAppointmentByIdController extends BaseController {
  public async executeImpl(req: DecodedExpressReq) {
    try {
      const accountId = AccountId.create(new UniqueEntityID(req.accountId));
      const appointmentId = AppointmentId.create(new UniqueEntityID(req.params.appointmentId));

      const appointment = await AppoinmentRepository.findAppointmentByAppointmentAndAccountId(appointmentId.getValue(), accountId.getValue());

      const appointmentDTO: ResponseAppointmentDTO = {
        id: appointment.appointmentId.value,
        clientId: appointment.clientId?.value || null,
        date: appointment.date,
        status: appointment.status.value,
        duration: appointment.duration.value,
        startTime: appointment.startTime.value,
        treatments: this.treatmentsToDto(appointment.treatments),
      };

      return this.ok<ResponseAppointmentDTO>(this.res, appointmentDTO);
    } catch (error) {
      return this.fail(error.message);
    }
  }

  private filledCardToDto(treatment: Treatment): FilledCardDTO {
    return {
      name: treatment.filledCard?.name,
      treatmentCardId: treatment.filledCard?.treatmentCardId.value,
      template: treatment.filledCard?.template,
    };
  }

  private treatmentsToDto(treatments: Treatments): TreatmentDTO[] {
    return treatments.list.map((treatment) => ({
      id: treatment.treatmentId.value,
      name: treatment.name,
      startTime: treatment?.startTime || null,
      duration: treatment?.duration || null,
      assingedCardId: treatment.assingedCardId?.value || null,
      notes: treatment.notes || null,
      price: treatment.price || null,
      filledCard: this.filledCardToDto(treatment),
    }));
  }
}
