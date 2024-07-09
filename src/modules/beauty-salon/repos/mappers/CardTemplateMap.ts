import { Mapper } from 'src/shared/Mapper';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardTemplate } from '../../domain/card/CardTemplate';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { CardTemplateModel } from 'src/db/mongoose/cardTemplate.sheema';
import { CardTemplateField } from '../../domain/card/CardTemplateField';

export class CardTemplateMap implements Mapper<CardTemplate, CardTemplateModel> {
  toPersistence(cardTemplate: CardTemplate): CardTemplateModel {
    return {
      _id: cardTemplate.id.value,
      name: cardTemplate.name,
      account_id: cardTemplate.accountId.value,
      description: '',
      fields: cardTemplate.fields,
    };
  }

  toDomain(cardTemplateRaw: CardTemplateModel): CardTemplate {
    const template = CardTemplate.create(
      {
        accountId: AccountId.create(new UniqueEntityID(cardTemplateRaw.account_id)),
        name: cardTemplateRaw.name,
        fields: cardTemplateRaw.fields.map((item) =>
          CardTemplateField.create({
            description: item.description,
            identifier: item.identifier,
            label: item.label,
            optionalValues: item.optionalValues,
            value: item.value,
          }),
        ),
      },
      new UniqueEntityID(cardTemplateRaw._id),
    );

    return template;
  }
}
