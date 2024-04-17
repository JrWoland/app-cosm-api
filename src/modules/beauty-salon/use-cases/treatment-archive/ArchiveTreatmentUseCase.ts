import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveTreatmentCommand } from './ArchiveTreatmentCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { TreatmentRepository } from '../../repos/Treatment.repository';

type Result = { message: string; id: string; success: boolean };

@CommandHandler(ArchiveTreatmentCommand)
export class ArchiveTreatmentUseCase implements ICommandHandler<ArchiveTreatmentCommand, Result> {
  constructor(private readonly treatmentsRepository: TreatmentRepository) {}

  async execute(command: ArchiveTreatmentCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, treatmentId } = command;

    const accountID = AccountId.create(new UniqueEntityID(accountId));
    const treatmentID = TreatmentId.create(new UniqueEntityID(treatmentId));

    const treatment = await this.treatmentsRepository.findTreatmentById(treatmentID, accountID);

    treatment.archiveTreatment();

    try {
      await this.treatmentsRepository.save(treatment);
      return { id: treatmentID.value, message: 'Treatment archived.', success: true };
    } catch (error) {
      return { id: treatmentID.value, message: 'Could not archive treatment', success: false };
    }
  }
}
