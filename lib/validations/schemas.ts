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

export const stepCreateSchema = z.object({
  trip_id: z.number().int().positive(),
  step_type_id: z.number().int().positive(),
  position: z.number().int().positive().optional(),
  travel_name: z.string().nullable().optional().default(null),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().nullable().optional().default(null),
  start_time: z.string().nullable().optional().default(null),
  end_time: z.string().nullable().optional().default(null),
  point_departure: z.string().nullable().optional().default(null),
  point_arrival: z.string().nullable().optional().default(null),
  gpx_file_url: z.string().nullable().optional().default(null),
  distance_km: z.number().nullable().optional().default(null),
  elevation_gain_m: z.number().int().nullable().optional().default(null),
  map_center_lat: z.number().nullable().optional().default(null),
  map_center_lng: z.number().nullable().optional().default(null),
  points_of_interest: z
    .array(
      z.object({
        name: z.string().min(1),
        lat: z.number(),
        lng: z.number(),
        description: z.string().nullable().optional().default(null),
      }),
    )
    .nullable()
    .optional()
    .default(null),
  visibility: z.enum(['public', 'private']).default('public'),
  private_notes: z.string().nullable().optional().default(null),
  booking_ref_private: z.string().nullable().optional().default(null),
});

export const stepUpdateSchema = z
  .object({
    step_type_id: z.number().int().positive().optional(),
    position: z.number().int().positive().optional(),
    travel_name: z.string().nullable().optional(),
    start_date: z.string().optional(),
    end_date: z.string().nullable().optional(),
    start_time: z.string().nullable().optional(),
    end_time: z.string().nullable().optional(),
    point_departure: z.string().nullable().optional(),
    point_arrival: z.string().nullable().optional(),
    gpx_file_url: z.string().nullable().optional(),
    distance_km: z.number().nullable().optional(),
    elevation_gain_m: z.number().int().nullable().optional(),
    map_center_lat: z.number().nullable().optional(),
    map_center_lng: z.number().nullable().optional(),
    points_of_interest: z
      .array(
        z.object({
          name: z.string().min(1),
          lat: z.number(),
          lng: z.number(),
          description: z.string().nullable().optional().default(null),
        }),
      )
      .nullable()
      .optional(),
    visibility: z.enum(['public', 'private']).optional(),
    private_notes: z.string().nullable().optional(),
    booking_ref_private: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type StepCreateInput = z.infer<typeof stepCreateSchema>;
export type StepUpdateInput = z.infer<typeof stepUpdateSchema>;
