import { FastifyRequest, FastifyReply } from "fastify";
export declare function createTransaction(req: FastifyRequest, res: FastifyReply): Promise<void>;
export declare function getTransactions(req: FastifyRequest, res: FastifyReply): Promise<void>;
export declare function updateTransaction(req: FastifyRequest, res: FastifyReply): Promise<undefined>;
export declare function deleteTransaction(req: FastifyRequest, res: FastifyReply): Promise<undefined>;
