import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { Mapper } from '../../../../core/infra/Mapper';
import { CardDocModel } from '../../../../infra/db/models/cardModel';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Card } from '../../domain/Card';

export class CardMap implements Mapper<Card, CardDocModel> {
  toPersistence(card: Card): CardDocModel {
    const template = card.template.map((field) => ({
      identifier: field.identifier,
      name: field.name,
      selected_options: field.selectedOptions,
      available_options: field.availableOptions,
      description: field.description,
      custom: field.custom,
    }));

    return {
      _id: card.treatmentCardId.value,
      account_id: card.accountId.id.getValue(),
      is_template_filled: card.isTemplateFilled,
      name: card.name,
      template: template,
    };
  }

  toDomain(raw: CardDocModel): Card {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));
    const template = raw.template.map((field) => ({
      availableOptions: field.available_options,
      identifier: field.identifier,
      name: field.name,
      selectedOptions: field.selected_options,
      custom: field.custom,
      description: field.description,
    }));
    const card = Card.create(
      {
        accountId: accountId.getValue(),
        isTemplateFilled: raw.is_template_filled,
        name: raw.name,
        template: template,
      },
      new UniqueEntityID(raw._id),
    );

    return card.getValue();
  }
}
