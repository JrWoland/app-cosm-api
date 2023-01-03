import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { CardId } from './CardId';
import { ICardField } from './defaultCardTemplates/TreatmentCardTemplate';
import { has } from 'lodash';
import { AccountId } from '../../accounts/domain/AccountId';
import { Entity } from '../../../core/domain/Entity';

interface CardProps {
  accountId: AccountId;
  name: string;
  isTemplateFilled: boolean;
  template: ICardField[];
}

const TREATMENT_CARD_ERRORS = {
  NAME_ERROR_MESSAGE: 'Treatment card need to have a name.',
  DURATION_ERROR_MESSAGE: 'Duration must be greater than 0.',
  PRICE_ERROR_MESSAGE: 'Price must be greater than 0.',
  TEMPLATE_ERROR_MESSAGE: 'Invalid template.',
};

export class Card extends Entity<CardProps> {
  private constructor(props: CardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public get treatmentCardId(): CardId {
    return CardId.create(this._uniqueEntityId).getValue();
  }

  public get template() {
    return this.props.template;
  }

  public get isTemplateFilled() {
    return this.props.isTemplateFilled;
  }

  public get name() {
    return this.props.name;
  }

  private setName(name: string): Result<string> {
    const hasName = !!name;
    if (!hasName) {
      const error = Result.fail<string>(TREATMENT_CARD_ERRORS.NAME_ERROR_MESSAGE);
      return error;
    }
    this.props.name = name;
    return Result.ok('Treatment card name has been set.');
  }

  private static isTemplateValid(template: ICardField[]): boolean {
    const result = template.every((item) => has(item, 'identifier') && has(item, 'name') && has(item, 'selectedOptions') && has(item, 'availableOptions'));
    return result;
  }

  private changeTemplate(template: ICardField[]): Result<string> {
    if (template && !Card.isTemplateValid(template)) {
      return Result.fail<string>(TREATMENT_CARD_ERRORS.TEMPLATE_ERROR_MESSAGE);
    }
    this.props.template = template;
    return Result.ok<string>('Template has been set.');
  }

  public updateDetails(card: Omit<CardProps, 'accountId' | 'template' | 'treatmentCardId'>): Result<string> {
    const results: Result<string>[] = [];

    if (has(card, 'name')) {
      results.push(this.setName(card.name));
    }

    const bulkResult = Result.bulkCheck<string>(results);

    if (bulkResult.isFailure) {
      return Result.fail(bulkResult.error);
    }

    return Result.ok(bulkResult.getValue());
  }

  public static create(props: CardProps, id?: UniqueEntityID): Result<Card> {
    if (props.template && !Card.isTemplateValid(props.template)) {
      return Result.fail<Card>(TREATMENT_CARD_ERRORS.TEMPLATE_ERROR_MESSAGE);
    }
    if (!props.name) {
      return Result.fail<Card>('Can not create client treatment card without name.');
    }
    if (!props.accountId) {
      return Result.fail<Card>('Can not create client treatment card without accountId.');
    }

    const treatmentCard = new Card(
      {
        accountId: props.accountId,
        name: props.name,
        template: props.template,
        isTemplateFilled: props.isTemplateFilled,
      },
      id,
    );

    return Result.ok<Card>(treatmentCard);
  }
}
