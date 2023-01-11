import mongoose from 'mongoose';

interface CardField {
  identifier: string;
  name: string;
  selected_options: string[] | number[];
  available_options: string[] | number[];
  description?: string;
  custom?: unknown;
}

interface CardDocModel {
  _id: string;
  account_id: string;
  name: string;
  is_template_filled: boolean;
  template: CardField[];
  created_at?: Date;
  updated_at?: Date;
}

const cardSheema = new mongoose.Schema<CardDocModel>(
  {
    _id: {
      type: String,
      required: true,
    },
    account_id: {
      type: String,
      required: true,
      ref: 'Account',
    },
    name: {
      type: String,
      required: true,
    },
    is_template_filled: {
      type: Boolean,
      required: true,
    },
    template: {
      type: Array,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const CardModel = mongoose.model<CardDocModel>('Card', cardSheema);

export { CardModel, CardDocModel };
