import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditTreatmentDetailsCommand } from './EditTreatmentDetailsCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { UnprocessableEntityException } from '@nestjs/common';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { TreatmentRepository } from '../../repos/Treatment.repository';
import { TreatmentName } from '../../domain/treatment/TreatmentName';
import { TreatmentPrice } from '../../domain/treatment/TreatmentPrice';
import { TreatmentDuration } from '../../domain/treatment/TreatmentDuration';
import { CardId } from '../../domain/card/CardId';

@CommandHandler(EditTreatmentDetailsCommand)
export class EditTreatmentDetailsUseCase implements ICommandHandler<EditTreatmentDetailsCommand> {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  async execute(command: EditTreatmentDetailsCommand) {
    const { accountId, treatmentId, name, price, duration, defaultCardId } = command;

    if (!accountId) {
      throw new UnprocessableEntityException('Missing account id.');
    }

    const acocuntID = AccountId.create(new UniqueEntityID(accountId));
    const treatmentID = TreatmentId.create(new UniqueEntityID(treatmentId));

    const treatment = await this.treatmentRepository.findTreatmentById(treatmentID, acocuntID);

    treatment.updateDetails({
      name: TreatmentName.create(name),
      price: TreatmentPrice.create(price),
      duration: TreatmentDuration.create(duration),
      defaultCardId: CardId.create(new UniqueEntityID(defaultCardId)),
    });

    await this.treatmentRepository.save(treatment);
  }
}
