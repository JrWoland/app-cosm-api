import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
class Template {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'AccountModel', index: true })
  account_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  fields: Record<string, any>[];
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'cards' })
export class CardModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'AccountModel', index: true })
  account_id: string;

  @Prop({ required: false, type: mongoose.Schema.Types.UUID, ref: 'AppointmentModel' })
  appointment: string | null;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'ClientModel' })
  client: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Template })
  template: Template;
}

export const CardSchema = SchemaFactory.createForClass(CardModel);
