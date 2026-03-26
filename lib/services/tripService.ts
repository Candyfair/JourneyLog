// lib/services/tripService.ts

import { SupabaseClient } from '@supabase/supabase-js'
import { Trip, TripWithSteps, PublicTrip, PublicStep, StepType, TripInsert, TripUpdate } from '@/types/database'
import { generateSlug } from '@/lib/utils/slug'

/**
 * Retrieves all trips belonging to a user, ordered by position.
 */
export async function getByUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trip')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Retrieves a single trip by ID, verifying ownership.
 * Throws if the trip does not exist or does not belong to the user.
 */
export async function getById(
  supabase: SupabaseClient,
  id: number,
  userId: string
): Promise<TripWithSteps> {
  const { data, error } = await supabase
    .from('trip')
    .select(`
      *,
      step (
        *,
        step_type (*),
        accommodation (*)
      )
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Retrieves a public trip by its share token.
 * Only returns public steps and excludes all private fields.
 * No authentication required.
 */
export async function getByShareToken(
  supabase: SupabaseClient,
  shareToken: string
): Promise<PublicTrip> {
  const { data, error } = await supabase
    .from('trip')
    .select(`
      id,
      trip_name,
      slug,
      description,
      cover_image,
      step (
        id,
        position,
        travel_name,
        start_date,
        end_date,
        start_time,
        end_time,
        point_departure,
        point_arrival,
        distance_km,
        elevation_gain_m,
        map_center_lat,
        map_center_lng,
        points_of_interest,
        visibility,
        step_type (*),
        accommodation (
          city,
          accommodation_type,
          checkin_time,
          checkout_time
        )
      )
    `)
    .eq('share_token', shareToken)
    .eq('is_public', true)
    .single()

  if (error) throw new Error(error.message)

  // Filter out private steps — RLS handles it at DB level,
  // but we filter here as a second layer of defense
  const { step: rawSteps, ...tripData } = data

    const publicSteps = (rawSteps ?? [])
    .filter((s: { visibility: string }) => s.visibility === 'public')
    .map((s: { step_type: StepType[]; [key: string]: unknown }) => ({
        ...s,
        step_type: s.step_type[0],         // unwrap array → single object
        accommodation: s.accommodation ?? null,
    })) as PublicStep[]

    return { ...tripData, steps: publicSteps }
}

/**
 * Creates a new trip for the authenticated user.
 */
export async function create(
  supabase: SupabaseClient,
  userId: string,
  data: TripInsert
): Promise<Trip> {
  const slug = generateSlug(data.trip_name)

  const { data: trip, error } = await supabase
    .from('trip')
    .insert({
      ...data,
      user_id: userId,
      slug,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return trip
}

/**
 * Updates an existing trip. Regenerates the slug if trip_name changes.
 */
export async function update(
  supabase: SupabaseClient,
  id: number,
  userId: string,
  data: TripUpdate
): Promise<Trip> {
  const updates = data.trip_name
    ? { ...data, slug: generateSlug(data.trip_name) }
    : data

  const { data: trip, error } = await supabase
    .from('trip')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return trip
}

/**
 * Deletes a trip. Cascades to steps and accommodations via DB constraints.
 */
export async function remove(
  supabase: SupabaseClient,
  id: number,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('trip')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

/**
 * Updates the position of multiple trips in a single batch.
 * Expects an array of objects with id and the new position.
 */
export async function reorder(
  supabase: SupabaseClient,
  userId: string,
  trips: { id: number; position: number }[]
): Promise<void> {
  const updates = trips.map(({ id, position }) =>
    supabase
      .from('trip')
      .update({ position })
      .eq('id', id)
      .eq('user_id', userId)
  )

  const results = await Promise.all(updates)
  const failed = results.find(({ error }) => error)
  if (failed?.error) throw new Error(failed.error.message)
}