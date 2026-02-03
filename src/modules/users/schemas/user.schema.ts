import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { BaseSchema } from '@common/database';
import { Status, UserRole } from '@common/enums';

import { UserDocumentType } from '../enums/user-document-type.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class User extends BaseSchema {
  /**
   * First name of the user.
   */
  @Prop()
  firstName: string;

  /**
   * Last name of the user.
   */
  @Prop()
  lastName: string;

  /**
   * Password of the user used for authentication.
   * Should be stored securely (hashed).
   */
  @Prop({ required: true })
  password: string;

  /**
   * Email address of the user.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * Phone number of the user.
   */
  @Prop({ required: true, unique: true })
  phone: string;

  /**
   * Type of document used for user identification.
   */
  @Prop({
    enum: UserDocumentType,
    type: String,
  })
  documentType: UserDocumentType;

  /**
   * Document number used for user identification.
   */
  @Prop({ required: true, unique: true })
  document: string;

  /**
   * Roles assigned to the user in the system.
   */
  @Prop()
  roles: UserRole[];

  /**
   * Parent information of the user. Contains contact data of the parent
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  parent: Pick<
    UserDocument,
    '_id' | 'firstName' | 'lastName' | 'email' | 'phone'
  > | null;

  /**
   * Current status of the user in the system.
   */
  @Prop({ enum: Status, default: Status.ACTIVE, type: String })
  status: Status;

  /**
   * Identifier of the user who created this record.
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: Pick<
    UserDocument,
    '_id' | 'firstName' | 'lastName' | 'email' | 'phone'
  > | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, ...result } = ret;
    return result;
  },
});
