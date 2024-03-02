import {
  TransactionRequest,
  UpdateTransactionRequest,
} from "./../schemas/transactionSchema";

import { FastifyInstance } from "fastify";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "./../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware";

export default function (
  app: FastifyInstance,
  _options: any,
  done: () => void
) {
  app.post(
    "/api/transactions",
    { preHandler: authenticate, schema: { body: TransactionRequest } },
    createTransaction
  );

  app.get("/api/transactions", { preHandler: authenticate }, getTransactions);

  app.put(
    "/api/transactions/:id",
    { preHandler: authenticate, schema: { body: UpdateTransactionRequest } },
    updateTransaction
  );

  app.delete(
    "/api/transactions/:id",
    { preHandler: authenticate },
    deleteTransaction
  );

  done();
}
