import { Entity } from 'src/shared/Entity';
import { has } from 'lodash';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { UnprocessableEntityException } from '@nestjs/common';

export interface ICardField {
  identifier: string;
  label: string;
  value: string[] | number[];
  optionalValues: string[] | number[];
  description: string;
}

export interface ICardTemplate {
  accountId: AccountId;
  name: string;
  fields: ICardField[];
}

export class CardTemplate extends Entity<ICardTemplate> {
  private constructor(
    protected readonly props: ICardTemplate,
    private readonly _id?: UniqueEntityID,
  ) {
    super(props, _id);
  }

  get id(): UniqueEntityID {
    return this._uniqueEntityId;
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

  private static validateFields(fields: ICardField[]): boolean {
    const result = fields.every(
      (item) => has(item, 'identifier') && has(item, 'label') && has(item, 'value') && has(item, 'optionalValues') && has(item, 'description'),
    );
    return result;
  }

  public static create(props: ICardTemplate, id?: UniqueEntityID) {
    if (!this.validateFields(props.fields)) {
      throw new UnprocessableEntityException('Unprocessable card fields.');
    }
    if (!props.name) {
      throw new UnprocessableEntityException('Template name is missing.');
    }
    return new CardTemplate(props, id);
  }
}
