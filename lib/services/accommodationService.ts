import { SupabaseClient } from '@supabase/supabase-js'
import {
  Accommodation,
  AccommodationInsert,
  AccommodationUpdate,
} from '@/types/database'

/**
 * Retrieves the accommodation attached to a step, if any.
 */
export async function getByStep(
  supabase: SupabaseClient,
  stepId: number
): Promise<Accommodation | null> {
  const { data, error } = await supabase
    .from('accommodation')
    .select('*')
    .eq('step_id', stepId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Creates an accommodation record attached to a step.
 * A step can only have one accommodation — enforced at the API layer.
 */
export async function create(
  supabase: SupabaseClient,
  data: AccommodationInsert
): Promise<Accommodation> {
  const { data: accommodation, error } = await supabase
    .from('accommodation')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return accommodation
}

/**
 * Updates an existing accommodation record.
 */
export async function update(
  supabase: SupabaseClient,
  id: number,
  data: AccommodationUpdate
): Promise<Accommodation> {
  const { data: accommodation, error } = await supabase
    .from('accommodation')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return accommodation
}

/**
 * Deletes an accommodation record.
 */
export async function remove(
  supabase: SupabaseClient,
  id: number
): Promise<void> {
  const { error } = await supabase
    .from('accommodation')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}