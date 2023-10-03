import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { AccountId } from '../../../accounts/domain/AccountId';
import { ClientId } from '../../../clients/domain/ClientId';
import { AppointmentId } from '../../domain/AppointmentId';
import { Treatment } from '../../domain/Treatment';
import { TreatmentId } from '../../domain/TreatmentId';
import { Treatments } from '../../domain/Treatments';
import { IAppoinmentRepo } from '../../repo/AppoinmentRepo';
import { ITreatmentRepo } from '../../repo/TreatmentRepo';
import { TreatmentService } from '../../services/TreatmentService';
import { TreatmentDTO, UpdateAppointmentDTO } from './UpdateAppointmentDTO';
interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}
type Response = Result<AppointmentResponseDTO>;

export class UpdateAppointmentUseCase implements UseCase<UpdateAppointmentDTO, Promise<Response>> {
  constructor(private appoinmentRepo: IAppoinmentRepo, private treatmentRepo: ITreatmentRepo, private treatmentService: TreatmentService) {}

  private async fetchTreatments(treatments: TreatmentDTO[], accountId: AccountId): Promise<Result<Treatment[]>> {
    const treatmentsList = await this.treatmentRepo.findTreatmentsByIds(
      treatments.map(({ id }) => TreatmentId.create(new UniqueEntityID(id)).getValue()),
      accountId,
    );
    return Result.ok<Treatment[]>(treatmentsList);
  }

  public async execute(request: UpdateAppointmentDTO): Promise<Response> {
    const { accountId, appointmentId, date, duration, startTime, treatments, clientId } = request;

    const accId = AccountId.create(new UniqueEntityID(accountId)).getValue();
    const appId = AppointmentId.create(new UniqueEntityID(appointmentId)).getValue();

    if (!accountId) {
      return Result.fail('Auth failed.');
    }

    if (!appointmentId) {
      return Result.fail('Invalid appointment id.');
    }

    try {
      const [appointment, fetchedTreatmens] = await Promise.all([this.appoinmentRepo.findAppointmentByAppointmentAndAccountId(appId, accId), this.fetchTreatments(treatments, accId)]);

      const matchedTreatments = this.treatmentService.matchTreatments(fetchedTreatmens.getValue(), treatments);

      const treatmentsToAssign = Treatments.create(matchedTreatments);

      const updateResult = appointment.updateDetails({
        date: date,
        clientId: clientId,
        duration: duration,
        startTime: startTime,
        treatments: treatmentsToAssign,
      });

      if (updateResult.isFailure) {
        return Result.fail(updateResult.error);
      }

      this.appoinmentRepo.save(appointment);

      return Result.ok({ message: 'Appointment updated.', appointmentId: appointment.appointmentId.value });
    } catch (error) {
      return Result.fail('Appointment could not be updated.');
    }
  }
}
