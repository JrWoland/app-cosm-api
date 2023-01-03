import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Card } from '../Card';
import { ICardField } from '../defaultCardTemplates/TreatmentCardTemplate';

const accountId = AccountId.create().getValue();
const cardId = new UniqueEntityID('my-id');

interface CardProps {
  accountId: AccountId;
  name: string;
  isTemplateFilled: boolean;
  template: ICardField[];
}

const mockCard = (): CardProps => ({
  accountId: accountId,
  isTemplateFilled: false,
  name: 'Card',
  template: [],
});

describe('Test create()', () => {
  it('Should be able to create Card', () => {
    const card = Card.create(mockCard(), cardId).getValue();

    expect(card.isTemplateFilled).toEqual(false);
    expect(card.name).toEqual('Card');
    expect(card.template).toBeInstanceOf(Array);
    expect(card.treatmentCardId.value).toEqual('my-id');
  });

  it('Should not be able to create Card with invalid template structure.', () => {
    const data = mockCard();
    data.template.push({ wrong: 'item' } as unknown as ICardField); // force bad template
    const card = Card.create(data, cardId);

    expect(card.isFailure).toEqual(true);
    expect(card.error).toEqual('Invalid template.');
  });

  it('Should not be able to create Card without name property', () => {
    const data = mockCard();
    data.name = '';
    const card = Card.create(data, cardId);

    expect(card.isFailure).toEqual(true);
    expect(card.error).toEqual('Can not create client treatment card without name.');
  });

  it('Should not be able to create Card without accountId property', () => {
    const data = mockCard();
    data.accountId = '' as unknown as AccountId; // force wrong AccountId
    const card = Card.create(data, cardId);

    expect(card.isFailure).toEqual(true);
    expect(card.error).toEqual('Can not create client treatment card without accountId.');
  });
});
