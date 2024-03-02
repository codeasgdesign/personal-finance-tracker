import { Type } from "@sinclair/typebox";

export const TransactionRequest = Type.Object({
  amount: Type.Number(),
  date: Type.String(),
  category: Type.String(),
  type: Type.String({ enum: ["income", "expense"] }),
  description: Type.String(),
});

export const UpdateTransactionRequest = Type.Partial(TransactionRequest);
