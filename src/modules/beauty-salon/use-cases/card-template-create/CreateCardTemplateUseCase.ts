import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCardTemplateCommand } from './CreateCardTemplateCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { CardTemplate } from '../../domain/card/CardTemplate';
import { CardTemplatesRepository } from '../../repos/CardTemplates.repository';
import { CardTemplateField } from '../../domain/card/CardTemplateField';

@CommandHandler(CreateCardTemplateCommand)
export class CreateCardTemplateUseCase implements ICommandHandler<CreateCardTemplateCommand> {
  constructor(private readonly cardTemplatesRepository: CardTemplatesRepository) {}

  async execute(command: CreateCardTemplateCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, name, fields } = command;

    const accountID = AccountId.create(new UniqueEntityID(accountId));

    const cardTemplate = CardTemplate.create(
      {
        accountId: accountID,
        name: name,
        fields: fields.map((i) => CardTemplateField.create(i)),
      },
      new UniqueEntityID(),
    );

    await this.cardTemplatesRepository.save(cardTemplate);

    return { id: cardTemplate.id.value, message: 'Success', success: true };
  }
}
