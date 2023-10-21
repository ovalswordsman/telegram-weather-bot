import { Document, Schema, model } from 'mongoose';

export interface User extends Document {
  chatId: number;
  first_name: string;
  last_name: string;
  isSubscribed: boolean;
}

const userSchema = new Schema<User>({
  chatId: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  isSubscribed: { type: Boolean, default: false },
});

export const UserModel = model<User>('User', userSchema);
