import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ClientModel } from './client.sheema';
import { TreatmentModel } from './treatment.sheema';
import { AppointmentModel } from './appointment.sheema';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'cards' })
export class CardModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  account_id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'AppointmentModel' })
  appointment: AppointmentModel;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'ClientModel' })
  client: ClientModel;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'TreatmentModel' })
  treatment: TreatmentModel;

  @Prop({ required: true })
  template: unknown[];
}

export const CardSchema = SchemaFactory.createForClass(CardModel);
