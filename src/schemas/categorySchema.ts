import { Type } from '@sinclair/typebox';

export const CreateCategoryRequest = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 50 })
});

export const UpdateCategoryRequest = Type.Partial(CreateCategoryRequest)
export const DeleteCategoryRequest = Type.Object({
    id: Type.String({ minLength: 1, maxLength: 50 })
})

