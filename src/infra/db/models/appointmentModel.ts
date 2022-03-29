import mongoose from 'mongoose';

// type AppointmentStatus = 'NEW' | 'FINISHED' | 'DECLINED' | 'CLIENT_NOT_APPEARD';

export interface AppointmentDocModel {
  _id: mongoose.Types.ObjectId;
  account_id: mongoose.Schema.Types.ObjectId;
  date: Date;
  start_time: number;
  duration: number;
  status: string;
  services: [];
  created_at?: Date;
  updated_at?: Date;
}
// dayjs.duration(1, )
const appointmentSheema = new mongoose.Schema<AppointmentDocModel>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account',
  },
  date: { type: Date },
  start_time: { type: Number, required: true, min: 0, max: 1440 }, // minutes
  duration: { type: Number, required: true, min: 0 }, // minutes
  status: {
    type: String,
    required: true,
    // values: [AppointmentStatus.New, AppointmentStatus.ClientNotAppear, AppointmentStatus.Declined, AppointmentStatus.Finished],
  },
});

const AppointmentModel = mongoose.model<AppointmentDocModel>('Appointment', appointmentSheema);

export { AppointmentModel };
