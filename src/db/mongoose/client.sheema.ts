import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { mailRegex } from 'src/shared/regex/mailRegex';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'clients' })
export class ClientModel {
  @Prop({ type: mongoose.Schema.Types.UUID, required: true })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.UUID, ref: 'Account', index: true })
  account_id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  surname: string;

  @Prop({ required: true })
  status: 'ACTIVE' | 'ARCHIVED' | 'BANNED';

  @Prop({ type: mongoose.Schema.Types.Date })
  birth_day: Date | null;

  @Prop({ type: mongoose.Schema.Types.String })
  phone: string | null;

  @Prop({ match: mailRegex, type: mongoose.Schema.Types.String })
  email: string | null;
}

export const ClientSchema = SchemaFactory.createForClass(ClientModel);
