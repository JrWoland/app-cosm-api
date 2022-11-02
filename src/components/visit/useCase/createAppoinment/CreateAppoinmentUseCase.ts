import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { Account } from '../../../accounts/domain/Account';
import { AccountId } from '../../../accounts/domain/AccountId';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { ClientId } from '../../../clients/domain/ClientId';
import { Appointment } from '../../domain/Appointment';
import { AppointmentStatus } from '../../domain/AppointmentStatus';
import { TreatmentId } from '../../domain/TreatmentId';
import { Treatments } from '../../domain/Treatments';
import { IAppoinmentRepo } from '../../repo/AppoinmentRepo';
import { ITreatmentRepo } from '../../repo/TreatmentRepo';
import { CreateAppoinmentDTO, TreatmentDTO } from './CreateAppoinmentDTO';
interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}
type Response = Result<AppointmentResponseDTO>;
export class CreateAppoinmentUseCase implements UseCase<CreateAppoinmentDTO, Promise<Response>> {
  constructor(private appoinmentRepo: IAppoinmentRepo, private accountRepo: IAccountRepo, private treatmentRepo: ITreatmentRepo) {}

  private async getTreatments(treatments: TreatmentDTO[], id: AccountId): Promise<Result<Treatments>> {
    try {
      const treatmentsList = await this.treatmentRepo.findTreatmentsByIds(
        treatments.map(({ id }) => TreatmentId.create(new UniqueEntityID(id)).getValue()),
        id,
      );

      treatments.forEach((tr) => {
        const toUpdateTr = treatmentsList.find((val) => val.treatmentId.value === tr.id);
        if (!toUpdateTr) throw new Error('Could not find treatment with id: ' + tr.id);
        toUpdateTr?.updateDetails({
          duration: tr.duration,
          startTime: tr.startTime,
        });
      });

      const treatmentsToAssign = Treatments.create(treatmentsList);
      return Result.ok<Treatments>(treatmentsToAssign);
    } catch (error) {
      return Result.fail<Treatments>(error.message);
    }
  }

  public async execute(request: CreateAppoinmentDTO): Promise<Response> {
    const { accountId, date, duration, startTime, treatments, clientId, status } = request;

    const accountIdToAssign = AccountId.create(new UniqueEntityID(accountId));
    const clientIdToAssign = ClientId.create(new UniqueEntityID(clientId));

    try {
      const treatmentsList = await this.getTreatments(treatments, accountIdToAssign.getValue());
      const newAppoinment = Appointment.create(
        {
          accountId: accountIdToAssign.getValue(),
          clientId: clientId ? clientIdToAssign.getValue() : null,
          date: date,
          duration: duration,
          startTime: startTime,
          status: status || AppointmentStatus.New,
          treatments: treatmentsList.getValue(),
        },
        new UniqueEntityID(),
      );

      if (newAppoinment.isFailure) {
        return Result.fail(newAppoinment.error);
      }

      await this.appoinmentRepo.save(newAppoinment.getValue());

      return Result.ok({ message: 'Appointment created.', appointmentId: newAppoinment.getValue().appointmentId.value });
    } catch (error) {
      return Result.fail('Appointment could not be created. ' + error.message);
    }
  }
}
