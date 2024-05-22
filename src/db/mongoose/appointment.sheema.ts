import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TreatmentModel } from './treatment.sheema';
import { ClientModel } from './client.sheema';

export type AppointmentDocument = mongoose.Document<AppointmentModel>;

function arrayLimit(v = [1]) {
  return v.length !== 0;
}

@Schema({ _id: false })
class SelectedTreatment {
  @Prop({ required: true, ref: 'TreatmentModel', type: mongoose.Schema.Types.UUID })
  treatment_details: TreatmentModel;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  start_time: number;

  @Prop({ required: true })
  duration: number;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'appointments' })
export class AppointmentModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, index: true })
  account_id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'ClientModel' })
  client_details: ClientModel;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  start_time: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  status: 'CLIENT_NOT_APPEARD' | 'DECLINED' | 'FINISHED' | 'NEW';

  @Prop({
    required: true,
    type: [SelectedTreatment],
    validate: [arrayLimit, '{PATH} cannot be 0'],
  })
  services: SelectedTreatment[];
}

export const AppointmentSchema = SchemaFactory.createForClass(AppointmentModel);
