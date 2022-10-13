import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Result } from '../../../core/logic/Result';
import { TreatmentCardId } from './TreatmentCardId';
import { ClientId } from '../../clients/domain/ClientId';
import { TreatmentCardTemplate } from './TreatmentCardTemplate';
import { has } from 'lodash';
import { AccountId } from '../../accounts/domain/AccountId';

interface TreatmentCardProps {
  accountId: AccountId;
  clientId: ClientId;
  name: string;
  price?: number;
  duration?: number;
  notes?: string;
  template?: TreatmentCardTemplate[];
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

  public get clientId(): ClientId {
    return this.props.clientId;
  }

  public get template() {
    return this.props.template;
  }

  public get name() {
    return this.props.name;
  }

  public get price() {
    return this.props.price;
  }

  public get duration() {
    return this.props.duration;
  }

  public get notes() {
    return this.props.notes;
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

  private setTemplate(template: TreatmentCardTemplate[]): Result<string> {
    if (template && !TreatmentCard.isTemplateValid(template)) {
      return Result.fail<string>(TREATMENT_CARD_ERRORS.TEMPLATE_ERROR_MESSAGE);
    }
    this.props.template = template;
    return Result.ok<string>('Template has been set.');
  }

  private setPrice(price: number): Result<string> {
    if (price < 0) {
      const error = Result.fail<string>(TREATMENT_CARD_ERRORS.PRICE_ERROR_MESSAGE);
      return error;
    }
    this.props.price = price;
    return Result.ok('Treatment card price has been set.');
  }

  private setDuration(duration: number): Result<string> {
    if (duration < 0) {
      const error = Result.fail<string>(TREATMENT_CARD_ERRORS.DURATION_ERROR_MESSAGE);
      return error;
    }
    this.props.duration = duration;
    return Result.ok('Treatment card duration has been set.');
  }

  private setNotes(notes: string): Result<string> {
    this.props.notes = notes;
    return Result.ok('Treatment card notes has been set.');
  }

  private static isTemplateValid(template: TreatmentCardTemplate[]): boolean {
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
    if (has(card, 'duration')) {
      results.push(this.setDuration(card.duration || 0));
    }
    if (has(card, 'price')) {
      results.push(this.setPrice(card.price || 0));
    }
    if (has(card, 'notes')) {
      results.push(this.setNotes(card.notes || ''));
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
    if (!props.clientId) {
      return Result.fail<TreatmentCard>('Can not create client treatment card without clientId.');
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
        clientId: props.clientId,
        name: props.name,
        template: props.template,
        price: props.price,
        duration: props.duration,
        notes: props.notes,
      },
      id,
    );

    return Result.ok<TreatmentCard>(treatmentCard);
  }
}
