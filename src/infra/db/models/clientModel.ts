import mongoose from 'mongoose';
import { ClientStatus } from '../../../components/clients/domain/ClientStatus';
import { mailRegex } from '../../../core/utils/mailRegex';

export interface ClientDocModel {
  _id: string;
  account_id: string;
  name: string;
  status: ClientStatus;
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
    status: {
      type: String,
      required: true,
      values: [ClientStatus.Archived, ClientStatus.Active, ClientStatus.Banned],
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
