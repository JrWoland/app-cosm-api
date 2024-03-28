import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class CardModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'Account' })
  account_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  template: unknown[];
}

export const CardSchema = SchemaFactory.createForClass(CardModel);
