import mongoose from 'mongoose';
import { AppointmentStatus } from '../../../components/visit/domain/AppointmentStatus';
import { TreatmentDocModel } from './treatmentModel';

export interface AppointmentDocModel {
  _id: string;
  account_id: string;
  client_id: string;
  date: Date;
  start_time: number;
  duration: number;
  status: string;
  services: TreatmentDocModel[];
  created_at?: Date;
  updated_at?: Date;
}
// dayjs.duration(1, )
const appointmentSheema = new mongoose.Schema<AppointmentDocModel>(
  {
    _id: {
      type: String,
      index: true,
      required: true,
    },
    account_id: {
      type: String,
      required: true,
      ref: 'Account',
    },
    client_id: {
      type: String,
      required: true,
      ref: 'Client',
    },
    date: {
      type: Date,
      required: true,
    },
    services: {
      type: Array,
      ref: 'Treatment',
      required: true,
    },
    start_time: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    }, // minutes
    duration: {
      type: Number,
      required: true,
      min: 1,
    }, // minutes
    status: {
      type: String,
      required: true,
      values: AppointmentStatus.allowedStatuses,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

appointmentSheema.set('autoIndex', false);

const AppointmentModel = mongoose.model<AppointmentDocModel>('Appointment', appointmentSheema);

export { AppointmentModel };
