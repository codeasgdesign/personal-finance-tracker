import { FastifyInstance } from "fastify";
import { registerUser, loginUser } from "./../controllers/authController";
import { RegisterUserRequest, LoginUserRequest } from "./../schemas/authSchema";

export default function (
  app: FastifyInstance,
  _options: any,
  done: () => void
) {
  app.post(
    "/api/users/register",
    { schema: { body: RegisterUserRequest } },
    registerUser
  );
  app.post(
    "/api/users/login",
    { schema: { body: LoginUserRequest } },
    loginUser
  );
  done();
}
