import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
const mailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  autoIndex: false,
})
export class AccountModel {
  @Prop({ required: true, type: mongoose.Schema.Types.UUID })
  _id: string;

  @Prop({ required: true, match: mailRegex })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
