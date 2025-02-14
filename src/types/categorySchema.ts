import { z } from 'zod';

export const CreateCategory = z.object({
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  description: z.string(),
});
export type CreateCategoryType = z.TypeOf<typeof CreateCategory>;

export const CreateAttribute = z.object({
  name: z.string(),
});
export type CreateAttributeType = z.TypeOf<typeof CreateAttribute>;

export const AttributeValueBody = z.object({
  value: z.string(),
  attribute: z.object({
    id: z.number(),
  }),
});
export type AttributeValueBodyType = z.TypeOf<typeof AttributeValueBody>;
