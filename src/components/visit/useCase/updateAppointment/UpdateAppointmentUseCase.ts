import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { ClientId } from '../../../clients/domain/ClientId';
import { AppointmentId } from '../../domain/AppointmentId';
import { TreatmentId } from '../../domain/TreatmentId';
import { Treatments } from '../../domain/Treatments';
import { IAppoinmentRepo } from '../../repo/AppoinmentRepo';
import { ITreatmentRepo } from '../../repo/TreatmentRepo';
import { UpdateAppointmentDTO } from './UpdateAppointmentDTO';
interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}
type Response = Result<AppointmentResponseDTO>;

export class UpdateAppointmentUseCase implements UseCase<UpdateAppointmentDTO, Promise<Response>> {
  constructor(private appoinmentRepo: IAppoinmentRepo, private treatmentRepo: ITreatmentRepo) {}

  public async execute(request: UpdateAppointmentDTO): Promise<Response> {
    const { accountId, appointmentId, date, duration, startTime, treatments, clientId, status } = request;

    if (!accountId) {
      return Result.fail('Auth failed.');
    }

    if (!appointmentId) {
      return Result.fail('Invalid appointment id.');
    }

    const appId = AppointmentId.create(new UniqueEntityID(appointmentId)).getValue();

    try {
      const appointment = await this.appoinmentRepo.findAppointmentByAppointmentId(appId);

      if (appointment.accountId.id.getValue() !== accountId) {
        return Result.fail('Appointment not found.');
      }

      const clientIdToAssign = ClientId.create(new UniqueEntityID(clientId));

      const treatmentsList = await this.treatmentRepo.findTreatmentByIds(treatments.map((i) => TreatmentId.create(new UniqueEntityID(i)).getValue()));
      const treatmentsToAssign = Treatments.create(treatmentsList);

      const updateResult = appointment.updateDetails({
        date: date,
        clientId: clientIdToAssign.getValue(),
        duration: duration,
        startTime: startTime,
        status: status,
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
