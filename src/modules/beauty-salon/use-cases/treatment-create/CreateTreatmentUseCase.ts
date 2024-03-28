import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTreatmentCommand } from './CreateTreatmentCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { Treatment } from '../../domain/treatment/Treatment';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { CardId } from '../../domain/card/CardId';
import { TreatmentDuration } from '../../domain/treatment/TreatmentDuration';
import { TreatmentName } from '../../domain/treatment/TreatmentName';
import { TreatmentPrice } from '../../domain/treatment/TreatmentPrice';
import { TreatmentRepository } from '../../repos/Treatment.repository';
import { UnprocessableEntityException } from '@nestjs/common';

@CommandHandler(CreateTreatmentCommand)
export class CreateTreatmentUseCase implements ICommandHandler<CreateTreatmentCommand> {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  async execute(command: CreateTreatmentCommand) {
    const { accountId, name, defaultCardId, duration, price } = command;

    if (!accountId) {
      throw new UnprocessableEntityException('Invalid account id.');
    }

    const accId = AccountId.create(new UniqueEntityID(accountId));

    const treatment = Treatment.create({
      id: TreatmentId.create(),
      accountId: accId,
      name: TreatmentName.create(name),
      price: TreatmentPrice.create(price),
      duration: TreatmentDuration.create(duration),
      defaultCardId: defaultCardId ? CardId.create(new UniqueEntityID(defaultCardId)) : null,
    });

    await this.treatmentRepository.save(treatment);
  }
}
