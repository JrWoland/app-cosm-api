import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { Account } from '../../../accounts/domain/Account';
import { AccountId } from '../../../accounts/domain/AccountId';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { ClientId } from '../../../clients/domain/ClientId';
import { Appointment } from '../../domain/Appointment';
import { AppointmentStatus } from '../../domain/AppointmentStatus';
import { IAppoinmentRepo } from '../../repo/AppoinmentRepo';
import { CreateAppoinmentDTO } from './CreateAppoinmentDTO';

interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}
type Response = Result<AppointmentResponseDTO>;
export class CreateAppoinmentUseCase implements UseCase<CreateAppoinmentDTO, Promise<Response>> {
  constructor(private appoinmentRepo: IAppoinmentRepo, private accountRepo: IAccountRepo) {}

  private async getAccount(accountId: AccountId): Promise<Result<Account>> {
    try {
      const account = await this.accountRepo.findAccountByAccountId(accountId);
      return Result.ok<Account>(account);
    } catch (error: any) {
      return Result.fail<Account>(error.message);
    }
  }

  public async execute(request: CreateAppoinmentDTO): Promise<Response> {
    const { accountId, date, duration, startTime, treatments, clientId } = request;

    const accountIdToAssign = AccountId.create(new UniqueEntityID(accountId));

    const account = await this.getAccount(accountIdToAssign.getValue());

    if (account.isFailure) {
      return Result.fail('Account does not exists.');
    }

    const clientIdToAssign = ClientId.create(new UniqueEntityID(clientId));

    try {
      const newAppoinment = Appointment.create(
        {
          accountId: accountIdToAssign.getValue(),
          clientId: clientId ? clientIdToAssign.getValue() : null,
          date: date,
          duration: duration,
          startTime: startTime,
          treatments: treatments,
          status: AppointmentStatus.New,
        },
        new UniqueEntityID(),
      );

      if (newAppoinment.isFailure) {
        return Result.fail(newAppoinment.error);
      }

      await this.appoinmentRepo.save(newAppoinment.getValue());

      return Result.ok({ message: 'Appointment created.', appointmentId: newAppoinment.getValue().appointmentId.value });
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
