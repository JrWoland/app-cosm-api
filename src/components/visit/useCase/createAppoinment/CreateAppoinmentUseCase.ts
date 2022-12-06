import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { AccountId } from '../../../accounts/domain/AccountId';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { ClientId } from '../../../clients/domain/ClientId';
import { Appointment } from '../../domain/Appointment';
import { AppointmentStatus } from '../../domain/AppointmentStatus';
import { Treatment } from '../../domain/Treatment';
import { TreatmentId } from '../../domain/TreatmentId';
import { Treatments } from '../../domain/Treatments';
import { IAppoinmentRepo } from '../../repo/AppoinmentRepo';
import { ITreatmentRepo } from '../../repo/TreatmentRepo';
import { TreatmentService } from '../../services/TreatmentService';
import { CreateAppoinmentDTO, TreatmentDTO } from './CreateAppoinmentDTO';
interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}
type Response = Result<AppointmentResponseDTO>;
export class CreateAppoinmentUseCase implements UseCase<CreateAppoinmentDTO, Promise<Response>> {
  constructor(private appoinmentRepo: IAppoinmentRepo, private accountRepo: IAccountRepo, private treatmentRepo: ITreatmentRepo, private treatmentService: TreatmentService) {}

  private async fetchTreatments(treatments: TreatmentDTO[], accountId: AccountId): Promise<Result<Treatment[]>> {
    const treatmentsList = await this.treatmentRepo.findTreatmentsByIds(
      treatments.map(({ id }) => TreatmentId.create(new UniqueEntityID(id)).getValue()),
      accountId,
    );
    return Result.ok<Treatment[]>(treatmentsList);
  }

  public async execute(request: CreateAppoinmentDTO): Promise<Response> {
    const { accountId, date, duration, startTime, treatments, clientId, status } = request;

    const accountIdToAssign = AccountId.create(new UniqueEntityID(accountId));
    const clientIdToAssign = ClientId.create(new UniqueEntityID(clientId));

    try {
      const fetchedTreatmens = await this.fetchTreatments(treatments, accountIdToAssign.getValue());
      const updatedTreatmentsToSave = this.treatmentService.matchTreatments(fetchedTreatmens.getValue(), treatments);
      const treatmentsList = Treatments.create(updatedTreatmentsToSave);

      const newAppoinment = Appointment.create(
        {
          accountId: accountIdToAssign.getValue(),
          clientId: clientId ? clientIdToAssign.getValue() : null,
          date: date,
          duration: duration,
          startTime: startTime,
          status: status || AppointmentStatus.New,
          treatments: treatmentsList,
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
