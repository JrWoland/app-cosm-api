import { beautyServiceScheema } from './beautyServiceModel';
import mongoose from 'mongoose';

const mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export interface AccountDocModel {
  account_id: string;
  email: string;
  password: string;
  services?: [any];
  payments?: [];
  createdAt?: Date;
  updatedAt?: Date;
}

const accountScheema = new mongoose.Schema<AccountDocModel>(
  {
    account_id: { type: String, unique: true, required: true },
    email: {
      type: String,
      required: true,
      match: mailRegex,
    },
    password: { type: String, required: true },
    services: {
      type: [beautyServiceScheema],
      default: () => ({ name: 'LASHES' }),
    },
    payments: { type: [Object] },
  },
  { timestamps: true },
);

accountScheema.set('autoIndex', false);

const AccountModel = mongoose.model<AccountDocModel>('Account', accountScheema);

export { AccountModel };
