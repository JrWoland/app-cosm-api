import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { Account } from '../../../accounts/domain/Account';
import { AccountId } from '../../../accounts/domain/AccountId';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { Treatment } from '../../domain/Treatment';
import { TreatmentCardId } from '../../domain/TreatmentCardId';
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

    try {
      const id = TreatmentId.create(new UniqueEntityID(treatmentId)).getValue();
      treatment = await this.treatmentRepo.findTreatmentById(id);

      if (accountId !== treatment.accountId.id.getValue()) {
        return Result.fail(UPDATE_TREATMENT_ERROR.TREATMENT_NOT_FOUND);
      }
    } catch (error) {
      return Result.fail(UPDATE_TREATMENT_ERROR.TREATMENT_NOT_FOUND);
    }

    treatment.setName(name);
    treatment.setNotes(notes);
    treatment.setDuration(duration || 0);
    treatment.setPrice(price || 0);

    //   try {
    //     const newTreatment = Treatment.create(
    //       {
    //         accountId: account.accountId,
    //         name: name,
    //         duration: duration,
    //         notes: notes,
    //         price: price,
    //         treatmentCardId: treatmentCardId,
    //       },
    //       new UniqueEntityID(),
    //     );

    //     if (newTreatment.isFailure) {
    //       return Result.fail(newTreatment.error);
    //     }

    //     await this.treatmentRepo.save(newTreatment.getValue());

    //     return Result.ok({ message: 'Treatment created.', treatmentId: newTreatment.getValue().treatmentId.value });
    //   } catch (error) {
    //     return Result.fail(error.message);
    //   }
    // }
  }
}
