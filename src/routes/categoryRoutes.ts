import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryRequest,
} from "./../schemas/categorySchema";

import { FastifyInstance } from "fastify";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./../controllers/categoryController";
import { authenticate } from "../middleware/authMiddleware";

export default function (
  app: FastifyInstance,
  _options: any,
  done: () => void
) {
  app.post(
    "/api/categories",
    { preHandler: authenticate, schema: { body: CreateCategoryRequest  } },
    createCategory
  );

  app.get("/api/categories", { preHandler: authenticate }, getCategories);

  app.put(
    "/api/categories/:id",
    { preHandler: authenticate, schema: { body:  UpdateCategoryRequest  } },
    updateCategory
  );

  app.delete(
    "/api/categories/:id",
    { preHandler: authenticate, schema: { params:  DeleteCategoryRequest  } },
    deleteCategory
  );

  done();
}
