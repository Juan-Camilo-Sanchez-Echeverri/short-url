import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '@common/database';

export type UrlDocument = HydratedDocument<Url>;

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class Url extends BaseSchema {
  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ required: true })
  redirectUrl: string;

  visitHistory: [{ timestamp: { type: number } }];
}

export const UrlSchema = SchemaFactory.createForClass(Url);
