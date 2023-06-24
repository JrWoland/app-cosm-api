import mongoose from 'mongoose';
import { ClientStatus } from '../../../components/clients/domain/ClientStatus';
import { mailRegex } from '../../../core/utils/mailRegex';

export interface ClientDocModel {
  _id: string;
  account_id: string;
  name: string;
  status: ClientStatus;
  surname: string | null;
  birth_day: Date | null;
  phone: string | null;
  email: string | null;
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
      required: false,
    },
    birth_day: {
      type: Date,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      match: mailRegex,
      required: false,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const ClientModel = mongoose.model<ClientDocModel>('Client', clientScheema);

export { ClientModel };
