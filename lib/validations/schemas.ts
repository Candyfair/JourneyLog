import { z } from 'zod';

export const tripCreateSchema = z.object({
  trip_name: z.string().min(1, 'Trip name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable().optional().default(null),
  cover_image: z.string().check(z.url()).nullable().optional().default(null),
  position: z.number().int().positive(),
  is_public: z.boolean().optional().default(false),
});

export const tripUpdateSchema = z
  .object({
    trip_name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().nullable().optional().default(null),
    cover_image: z.string().check(z.url()).nullable().optional().default(null),
    position: z.number().int().positive().optional(),
    is_public: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
