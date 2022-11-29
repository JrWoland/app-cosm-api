import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { Account } from '../../../accounts/domain/Account';
import { AccountId } from '../../../accounts/domain/AccountId';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { Treatment } from '../../domain/Treatment';
import { ITreatmentRepo } from '../../../visit/repo/TreatmentRepo';
import { CreateTreatmentDTO } from './CreateTreatmentDTO';
import { TreatmentCardId } from '../../domain/TreatmentCardId';

interface TreatmentResponseDTO {
  message: string;
  treatmentId: string;
}

type Response = Result<TreatmentResponseDTO>;

export class CreateTreatmentUseCase implements UseCase<CreateTreatmentDTO, Promise<Response>> {
  constructor(private treatmentRepo: ITreatmentRepo, private accountRepo: IAccountRepo) {}

  public async execute(request: CreateTreatmentDTO): Promise<Response> {
    let account: Account;

    const { accountId, name, duration, notes, price, treatmentCardId } = request;

    try {
      account = await this.accountRepo.findAccountByAccountId(AccountId.create(new UniqueEntityID(accountId)).getValue());
    } catch (error) {
      return Result.fail(error.message);
    }

    const cardId = treatmentCardId ? TreatmentCardId.create(new UniqueEntityID(treatmentCardId)).getValue() : undefined;

    try {
      const newTreatment = Treatment.create(
        {
          accountId: account.accountId,
          name: name,
          duration: duration,
          notes: notes,
          price: price,
          assingedCardId: cardId,
        },
        new UniqueEntityID(),
      );

      if (newTreatment.isFailure) {
        return Result.fail(newTreatment.error);
      }

      await this.treatmentRepo.save(newTreatment.getValue());

      return Result.ok({ message: 'Treatment created.', treatmentId: newTreatment.getValue().treatmentId.value });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
