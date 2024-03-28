import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAppointmentCommand } from './RemoveAppointmentCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { AppointmentRepository } from '../../repos/Appointment.repository';
import { AppointmentId } from '../../domain/appointment/AppointmentId';
import { UniqueEntityID } from 'src/shared/UniqueId';

@CommandHandler(RemoveAppointmentCommand)
export class RemoveAppointmentUseCase implements ICommandHandler<RemoveAppointmentCommand> {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(command: RemoveAppointmentCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, appointmentId } = command;

    const accId = AccountId.create(new UniqueEntityID(accountId));
    const appId = AppointmentId.create(new UniqueEntityID(appointmentId));

    const result = await this.appointmentRepository.deleteOne(appId, accId);

    return result;
  }
}
