// @packages
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ index: true, unique: true })
  id: string;

  @Prop({ type: String, enum: ['cc', 'ti', 'ce', 'pp'] })
  typeId: string;

  @Prop()
  fullName: string;

  @Prop()
  images: string[];

  @Prop()
  phoneNumber: number;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
