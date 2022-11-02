import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Treatment } from '../../domain/Treatment';
import { TreatmentId } from '../../domain/TreatmentId';
import { ITreatmentRepo } from '../../repo/TreatmentRepo';
import { UpdateTreatmentDTO } from './UpdateTreatmentDTO';
import { UPDATE_TREATMENT_ERROR } from './UpdateTreatmentErrors';

interface UpdateTreatmentResponseDTO {
  message: string;
  treatmentId: string;
}

type Response = Result<UpdateTreatmentResponseDTO>;

export class UpdateTreatmentUseCase implements UseCase<UpdateTreatmentDTO, Promise<Response>> {
  constructor(private treatmentRepo: ITreatmentRepo) {}

  public async execute(request: UpdateTreatmentDTO): Promise<Response> {
    let treatment: Treatment;
    const { accountId, name, notes, treatmentId, duration, price } = request;

    if (!treatmentId) {
      return Result.fail(UPDATE_TREATMENT_ERROR.MISSING_TREATMENT_ID);
    }

    const accId = AccountId.create(new UniqueEntityID(accountId)).getValue();

    try {
      const id = TreatmentId.create(new UniqueEntityID(treatmentId)).getValue();
      treatment = await this.treatmentRepo.findTreatmentById(id, accId);

      if (accountId !== treatment.accountId.id.getValue()) {
        return Result.fail(UPDATE_TREATMENT_ERROR.TREATMENT_NOT_FOUND);
      }
    } catch (error) {
      return Result.fail(UPDATE_TREATMENT_ERROR.TREATMENT_NOT_FOUND);
    }

    const updateResult = treatment.updateDetails({ name, duration, notes, price });

    if (updateResult.isFailure) {
      return Result.fail(updateResult.error);
    }

    await this.treatmentRepo.save(treatment);

    return Result.ok({ message: 'Client updated.', treatmentId: treatmentId });
  }
}
