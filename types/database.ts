// ============================================================
// Database types — mirrors the Supabase SQL schema
// ============================================================

// ----------------------------------------------------------
// Enum
// ----------------------------------------------------------

export type StepVisibility = 'public' | 'private'

// ----------------------------------------------------------
// Base types — one-to-one with database tables
// ----------------------------------------------------------

export type Trip = {
  id: number
  user_id: string
  trip_name: string
  slug: string
  description: string | null
  cover_image: string | null
  position: number
  is_public: boolean
  share_token: string
  created_at: string
  updated_at: string
}

export type StepType = {
  id: number
  code: string
  name: string
  icon: string | null
}

export type Step = {
  id: number
  trip_id: number
  step_type_id: number
  position: number
  travel_name: string | null
  start_date: string
  end_date: string | null
  start_time: string | null
  end_time: string | null
  point_departure: string | null
  point_arrival: string | null
  // Cycling data
  gpx_file_url: string | null
  distance_km: number | null
  elevation_gain_m: number | null
  map_center_lat: number | null
  map_center_lng: number | null
  // Points of interest: [{ name, lat, lng, description }]
  points_of_interest: PointOfInterest[] | null
  // Visibility and private fields
  visibility: StepVisibility
  private_notes: string | null
  booking_ref_private: string | null
  created_at: string
  updated_at: string
}

export type Accommodation = {
  id: number
  step_id: number
  // Public fields
  city: string
  accommodation_type: string | null
  // Private fields
  name_private: string | null
  address_private: string | null
  phone_private: string | null
  confirmation_ref_private: string | null
  checkin_time: string | null
  checkout_time: string | null
  created_at: string
  updated_at: string
}

// ----------------------------------------------------------
// Nested type — used in Step.points_of_interest (JSONB)
// ----------------------------------------------------------

export type PointOfInterest = {
  name: string
  lat: number
  lng: number
  description: string | null
}

// ----------------------------------------------------------
// Joined types — used when fetching related data together
// ----------------------------------------------------------

// Step with its step_type joined (used in most queries)
export type StepWithType = Step & {
  step_type: StepType
}

// Step with step_type AND accommodation joined
export type StepWithDetails = StepWithType & {
  accommodation: Accommodation | null
}

// Trip with all its steps (each step includes its type)
export type TripWithSteps = Trip & {
  steps: StepWithType[]
}

// ----------------------------------------------------------
// Public view types — private fields stripped out
// Used exclusively for the public share page
// ----------------------------------------------------------

// A step as seen by an anonymous visitor:
// - no booking_ref_private, no private_notes
// - only steps with visibility = 'public' are included
export type PublicStep = {
  id: number
  step_type: StepType
  position: number
  travel_name: string | null
  start_date: string
  end_date: string | null
  point_departure: string | null
  point_arrival: string | null
  distance_km: number | null
  elevation_gain_m: number | null
  map_center_lat: number | null
  map_center_lng: number | null
  points_of_interest: PointOfInterest[] | null
  accommodation: PublicAccommodation | null
}

// An accommodation as seen by an anonymous visitor:
// - city and type only, no name, address, phone or booking ref
export type PublicAccommodation = {
  id: number
  city: string
  accommodation_type: string | null
}

// A trip as seen by an anonymous visitor
export type PublicTrip = {
  id: number
  trip_name: string
  description: string | null
  cover_image: string | null
  steps: PublicStep[]
}

// ----------------------------------------------------------
// Insert / Update types — used in form submissions and API routes
// Omit auto-generated fields (id, created_at, updated_at)
// ----------------------------------------------------------

export type TripInsert = Omit<Trip, 'id' | 'created_at' | 'updated_at' | 'share_token'>
export type TripUpdate = Partial<Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'share_token'>>

export type StepInsert = Omit<Step, 'id' | 'created_at' | 'updated_at'>
export type StepUpdate = Partial<Omit<Step, 'id' | 'trip_id' | 'created_at' | 'updated_at'>>

export type AccommodationInsert = Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>
export type AccommodationUpdate = Partial<Omit<Accommodation, 'id' | 'step_id' | 'created_at' | 'updated_at'>>