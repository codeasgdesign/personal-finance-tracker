import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  user: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, 
}, { timestamps: true }); 

export const Category = mongoose.model<ICategory>('Category', categorySchema);
