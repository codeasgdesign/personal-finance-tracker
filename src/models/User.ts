import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, minlength: 1, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},{ timestamps: true });

export const User = mongoose.model<UserDocument>('User', UserSchema);
