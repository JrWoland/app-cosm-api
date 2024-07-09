import { ValueObject } from 'src/shared/ValueObject';

export interface ICardField {
  identifier: string;
  label: string;
  value: string[] | number[];
  optionalValues: string[] | number[];
  description: string;
}

export class CardTemplateField extends ValueObject<ICardField> {
  // TODO Fields validation
  constructor(props: ICardField) {
    super(props);
  }

  public get value(): ICardField {
    return this.props;
  }

  public static create(props: ICardField): CardTemplateField {
    return new CardTemplateField(props);
  }
}
