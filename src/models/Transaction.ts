import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  category: string;
  user: string; 
  type: 'income' | 'expense';
  description: string;
}

const TransactionSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  date: {
    type: Date,
    required: true,
  },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  description: { type: String, required: true }
},{ timestamps: true });

export const Transaction= mongoose.model<ITransaction>('Transaction', TransactionSchema);
