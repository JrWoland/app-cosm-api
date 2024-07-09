import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'card-templates' })
export class CardTemplateModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'AccountModel', index: true })
  account_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  fields: Record<string, any>[];
}

export const CardTemplateSchema = SchemaFactory.createForClass(CardTemplateModel);
