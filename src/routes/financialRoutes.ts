import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authMiddleware";
import { getSummary } from "../controllers/financialController";
import { SummaryRequestSchema } from "../schemas/financialSchema";

export default function (app: FastifyInstance, options: any, done: () => void) {
  app.post(
    "/api/summary",
    { preHandler: authenticate, schema: { body: SummaryRequestSchema } },
    getSummary
  );
  done();
}
