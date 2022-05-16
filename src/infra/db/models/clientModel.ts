import mongoose from 'mongoose';
import { mailRegex } from '../../../core/utils/mailRegex';

export interface ClientDocModel {
  _id: string;
  account_id: string;
  name: string;
  surname?: string;
  birth_day?: Date;
  phone?: string;
  email?: string;
}

const clientScheema = new mongoose.Schema<ClientDocModel>(
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
    surname: {
      type: String,
    },
    birth_day: {
      type: Date,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      match: mailRegex,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const ClientModel = mongoose.model<ClientDocModel>('Client', clientScheema);

export { ClientModel };
