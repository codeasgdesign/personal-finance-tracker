import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authMiddleware";
import { getMonthlyExpenseTrends, getSummary } from "../controllers/financialController";
import { MonthlyExpenseTrends, SummaryRequestSchema } from "../schemas/financialSchema";

export default function (app: FastifyInstance, _options: any, done: () => void) {
  app.post(
    "/api/summary",
    { preHandler: authenticate, schema: { body: SummaryRequestSchema } },
    getSummary
  );
  app.post(
    "/api/getMonthlyExpenseTrends",
    { preHandler: authenticate,schema: { querystring: MonthlyExpenseTrends } },
    getMonthlyExpenseTrends
  );
  done();
}
