import { Type } from '@sinclair/typebox';

export const RegisterUserRequest = Type.Object({

    username: Type.String({ minLength: 1, maxLength: 50 }),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),

});
export const LoginUserRequest = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),

});
