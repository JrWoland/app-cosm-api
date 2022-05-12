import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { AccountId } from '../../../accounts/domain/AccountId';
import { ClientId } from '../../../clients/domain/ClientId';
import { AppointmentId } from '../../domain/AppointmentId';
import { AppointmentStatus } from '../../domain/AppointmentStatus';
import { IAppoinmentRepo } from '../../repo/AppoinmentRepo';
import { UpdateAppointmentDTO } from './UpdateAppointmentDTO';

interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}
type Response = Result<AppointmentResponseDTO>;

export class UpdateAppointmentUseCase implements UseCase<UpdateAppointmentDTO, Promise<Response>> {
  constructor(private appoinmentRepo: IAppoinmentRepo) {}

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

      if (appointment.props.accountId.id.getValue() !== accountId) {
        return Result.fail('Appointment not found.');
      }

      const clientIdToAssign = ClientId.create(new UniqueEntityID(clientId));

      const updateResult = appointment.updateAll({
        date: date,
        clientId: clientIdToAssign.getValue(),
        duration: duration,
        startTime: startTime,
        status: status,
        treatments: treatments,
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
