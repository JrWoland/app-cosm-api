import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

type Currency = 'PLN';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'treatments' })
export class TreatmentModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'Account' })
  account_id: string;

  @Prop({ required: false, type: mongoose.Schema.Types.UUID, ref: 'Card' })
  default_card_id: string | null;

  @Prop({ required: true })
  name: string;

  @Prop()
  default_duration: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  default_price: { value: number | null; currency: Currency | null };
}

export const TreatmentSchema = SchemaFactory.createForClass(TreatmentModel);
