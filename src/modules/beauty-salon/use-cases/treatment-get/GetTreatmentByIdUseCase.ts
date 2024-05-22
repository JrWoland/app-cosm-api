import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTreatmentByIdQuery } from './GetTreatmentByIdQuery';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { TreatmentRepository } from '../../repos/Treatment.repository';

type ResponseResult = {
  id: string;
  name: string;
  duration: number;
  price: number;
  isArchived: boolean;
  defaultCardId?: string;
};

@QueryHandler(GetTreatmentByIdQuery)
export class GetTreatmentByIdUseCase implements IQueryHandler<GetTreatmentByIdQuery> {
  constructor(private readonly treatmentsRepository: TreatmentRepository) {}

  async execute(query: GetTreatmentByIdQuery): Promise<ResponseResult> {
    const accountID = AccountId.create(new UniqueEntityID(query.accountId));
    const treatmentID = TreatmentId.create(new UniqueEntityID(query.treatmentId));

    const treatment = await this.treatmentsRepository.findTreatmentById(treatmentID, accountID);
    treatment.defaultCardId;
    treatment.duration;
    treatment.price;
    treatment.isArchived;
    return {
      id: treatment.id.value,
      name: treatment.name.value,
      duration: treatment.duration.value,
      price: treatment.price.value,
      isArchived: treatment.isArchived,
      defaultCardId: treatment.defaultCardId?.value,
    };
  }
}
