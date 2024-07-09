import { Entity } from 'src/shared/Entity';
import { has } from 'lodash';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { UnprocessableEntityException } from '@nestjs/common';
import { CardTemplateId } from './CardTemplateId';
import { CardTemplateField } from './CardTemplateField';

export interface ICardTemplate {
  accountId: AccountId;
  name: string;
  fields: CardTemplateField[];
}

export class CardTemplate extends Entity<ICardTemplate> {
  private constructor(
    protected readonly props: ICardTemplate,
    private readonly _id?: UniqueEntityID,
  ) {
    super(props, _id);
  }

  get id(): CardTemplateId {
    return CardTemplateId.create(this._uniqueEntityId);
  }

  get accountId() {
    return this.props.accountId;
  }

  get name() {
    return this.props.name;
  }

  get fields() {
    return this.props.fields;
  }

  private static validateFields(fields: CardTemplateField[]): boolean {
    const result = fields.every(
      (item) => has(item, 'identifier') && has(item, 'label') && has(item, 'value') && has(item, 'optionalValues') && has(item, 'description'),
    );
    return result;
  }

  public static create(props: ICardTemplate, id?: UniqueEntityID) {
    if (!this.validateFields(props.fields)) {
      throw new UnprocessableEntityException('Unprocessable card template fields.');
    }
    if (!props.name) {
      throw new UnprocessableEntityException('Template name is missing.');
    }
    return new CardTemplate(props, id);
  }
}
