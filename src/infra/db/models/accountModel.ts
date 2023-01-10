import mongoose from 'mongoose';
import { mailRegex } from '../../../core/utils/mailRegex';

export interface AccountDocModel {
  _id: string;
  email: string;
  password: string;
  payments?: [];
  created_at?: Date;
  updated_at?: Date;
}

const accountScheema = new mongoose.Schema<AccountDocModel>(
  {
    _id: {
      type: String,
      index: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: mailRegex,
    },
    password: { type: String, required: true },
    payments: { type: [Object] },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

accountScheema.set('autoIndex', false);

const AccountModel = mongoose.model<AccountDocModel>('Account', accountScheema);

export { AccountModel };
