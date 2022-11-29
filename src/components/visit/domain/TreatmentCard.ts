import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Result } from '../../../core/logic/Result';
import { TreatmentCardId } from './TreatmentCardId';
import { ICardTemplate } from './defaultCardTemplates/TreatmentCardTemplate';
import { has } from 'lodash';
import { AccountId } from '../../accounts/domain/AccountId';

interface TreatmentCardProps {
  accountId: AccountId;
  name: string;
  template?: ICardTemplate[];
}

const TREATMENT_CARD_ERRORS = {
  NAME_ERROR_MESSAGE: 'Treatment card need to have a name.',
  DURATION_ERROR_MESSAGE: 'Duration must be greater than 0.',
  PRICE_ERROR_MESSAGE: 'Price must be greater than 0.',
  TEMPLATE_ERROR_MESSAGE: 'Invalid template.',
};

export class TreatmentCard extends AggregateRoot<TreatmentCardProps> {
  private constructor(props: TreatmentCardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public get treatmentCardId(): TreatmentCardId {
    return TreatmentCardId.create(this._uniqueEntityId).getValue();
  }

  public get template() {
    return this.props.template;
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

  private setTemplate(template: ICardTemplate[]): Result<string> {
    if (template && !TreatmentCard.isTemplateValid(template)) {
      return Result.fail<string>(TREATMENT_CARD_ERRORS.TEMPLATE_ERROR_MESSAGE);
    }
    this.props.template = template;
    return Result.ok<string>('Template has been set.');
  }

  private static isTemplateValid(template: ICardTemplate[]): boolean {
    const result = template.every((item) => {
      has(item, 'identifier') && has(item, 'name') && has(item, 'value') && has(item, 'options');
    });
    return result;
  }

  public updateDetails(card: Omit<TreatmentCardProps, 'accountId' | 'template' | 'treatmentCardId'>): Result<string> {
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

  public static create(props: TreatmentCardProps, id?: UniqueEntityID): Result<TreatmentCard> {
    if (props.template && !TreatmentCard.isTemplateValid(props.template)) {
      return Result.fail<TreatmentCard>('Invalid template.');
    }
    if (!props.name) {
      return Result.fail<TreatmentCard>('Can not create client treatment card without name.');
    }
    if (!props.accountId) {
      return Result.fail<TreatmentCard>('Can not create client treatment card without accountId.');
    }

    const treatmentCard = new TreatmentCard(
      {
        accountId: props.accountId,
        name: props.name,
        template: props.template,
      },
      id,
    );

    return Result.ok<TreatmentCard>(treatmentCard);
  }
}
