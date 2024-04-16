import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTreatmentsListQuery } from './GetTreatmentsListQuery';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentRepository } from '../../repos/Treatment.repository';

type TreatmentsResponse = {
  id: string;
  name: string;
  defaultDuration: number;
  defaultPrice: number;
  defaultCardId: string | null;
};

type ResponseResult = {
  count: number;
  limit: number;
  page: number;
  treatments: TreatmentsResponse[];
};

@QueryHandler(GetTreatmentsListQuery)
export class GetTreatmentsListUseCase implements IQueryHandler<GetTreatmentsListQuery> {
  constructor(private readonly treatmentsRepository: TreatmentRepository) {}

  async execute(query: GetTreatmentsListQuery): Promise<ResponseResult> {
    const accountId = AccountId.create(new UniqueEntityID(query.accountId));

    const { name, limit, page, status } = query;

    const { count, treatments } = await this.treatmentsRepository.findAllTreatmentsList(accountId, { limit, name, page, status });

    const treatmentsResult: TreatmentsResponse[] = treatments.map((treatment) => ({
      id: treatment.id.value,
      name: treatment.name.value,
      defaultDuration: treatment.duration.value,
      defaultPrice: treatment.price.value,
      defaultCardId: treatment.defaultCardId?.value || null,
    }));

    return {
      count,
      limit,
      page,
      treatments: treatmentsResult,
    };
  }
}
