import { FastifyRequest, FastifyReply } from 'fastify';
export declare function createCategory(req: FastifyRequest, res: FastifyReply): Promise<void>;
export declare function getCategories(req: FastifyRequest, res: FastifyReply): Promise<void>;
export declare function updateCategory(req: FastifyRequest, res: FastifyReply): Promise<undefined>;
export declare function deleteCategory(req: FastifyRequest, res: FastifyReply): Promise<undefined>;
