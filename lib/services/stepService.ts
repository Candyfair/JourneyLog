import { SupabaseClient } from '@supabase/supabase-js'
import {
  Step,
  StepWithDetails,
  StepInsert,
  StepUpdate,
} from '@/types/database'

/**
 * Retrieves all steps for a given trip, ordered by position.
 * Includes step_type and accommodation.
 */
export async function getByTrip(
  supabase: SupabaseClient,
  tripId: number
): Promise<StepWithDetails[]> {
  const { data, error } = await supabase
    .from('step')
    .select(`
      *,
      step_type (*),
      accommodation (*)
    `)
    .eq('trip_id', tripId)
    .order('position', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map((s) => ({
    ...s,
    step_type: s.step_type[0] ?? null,
    accommodation: s.accommodation?.[0] ?? null,
  })) as StepWithDetails[]
}

/**
 * Retrieves a single step by ID, including step_type and accommodation.
 */
export async function getById(
  supabase: SupabaseClient,
  id: number
): Promise<StepWithDetails> {
  const { data, error } = await supabase
    .from('step')
    .select(`
      *,
      step_type (*),
      accommodation (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return {
    ...data,
    step_type: data.step_type[0] ?? null,
    accommodation: data.accommodation?.[0] ?? null,
  } as StepWithDetails
}

/**
 * Creates a new step. Position defaults to end of the list if not provided.
 */
export async function create(
  supabase: SupabaseClient,
  data: StepInsert
): Promise<Step> {
  // If no position provided, place the step at the end
  if (data.position === undefined) {
    const { count } = await supabase
      .from('step')
      .select('*', { count: 'exact', head: true })
      .eq('trip_id', data.trip_id)

    data = { ...data, position: (count ?? 0) + 1 }
  }

  const { data: step, error } = await supabase
    .from('step')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return step
}

/**
 * Updates an existing step.
 */
export async function update(
  supabase: SupabaseClient,
  id: number,
  data: StepUpdate
): Promise<Step> {
  const { data: step, error } = await supabase
    .from('step')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return step
}

/**
 * Deletes a step. Cascades to accommodation via DB constraints.
 */
export async function remove(
  supabase: SupabaseClient,
  id: number
): Promise<void> {
  const { error } = await supabase
    .from('step')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

/**
 * Updates the position of multiple steps in a single batch.
 */
export async function reorder(
  supabase: SupabaseClient,
  steps: { id: number; position: number }[]
): Promise<void> {
  const updates = steps.map(({ id, position }) =>
    supabase
      .from('step')
      .update({ position })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const failed = results.find(({ error }) => error)
  if (failed?.error) throw new Error(failed.error.message)
}