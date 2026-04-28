# JourneyLog

> **Status: work in progress** — active development, not production-ready.

Personal web app for cycle touring trip planning, with secure itinerary sharing. Built as a modern rebuild of an earlier project ([TravelPlan](https://github.com/Candyfair/TravelPlan)).

---

## What it does

JourneyLog lets you plan multi-step cycle touring trips and share your itinerary with family and friends — without exposing sensitive data.

The core feature is a **two-tier privacy model** on the public sharing page:

| Data                                      | Owner (authenticated) | Visitor (public link) |
| ----------------------------------------- | --------------------- | --------------------- |
| Route maps, distances, elevation          | ✓                     | ✓                     |
| Daily summaries, departure/arrival cities | ✓                     | ✓                     |
| Exact addresses, hotel names              | ✓                     | ✗                     |
| Phone numbers, booking references         | ✓                     | ✗                     |
| Private notes, precise schedules          | ✓                     | ✗                     |

This design is intentional: solo travellers can share a trip link publicly while keeping logistically sensitive information private.

---

## Tech stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 14 (App Router)                      |
| Language   | TypeScript                                   |
| Database   | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Deployment | Vercel                                       |
| Maps       | Leaflet / React Leaflet                      |
| Forms      | React Hook Form + Zod                        |
| Tests      | Vitest                                       |

---

## Architecture overview

```
app/
├── (auth)/             # Login, signup pages
├── dashboard/          # Protected — trip list
├── trips/              # Protected — trip detail, step management
└── api/
    ├── trips/          # CRUD route handlers
    ├── steps/          # CRUD route handlers
    ├── accommodation/  # CRUD route handlers
    └── trip-public/
        └── [share_token]/  # Public endpoint — privacy-filtered response

lib/
├── services/
│   ├── tripService.ts          # ✓ complete
│   ├── stepService.ts          # ✓ complete
│   └── accommodationService.ts # ✓ complete
└── supabase/           # Client / server / middleware helpers

types/
└── database.ts         # TypeScript types mirroring the SQL schema
```

### Service layer

API route handlers delegate all database logic to `lib/services/`. This keeps route handlers thin and makes the business logic independently testable with Vitest.

### Security boundary

Row Level Security (RLS) is enabled on all four tables. Supabase RLS policies enforce data access at the database level — the service layer trusts these policies rather than re-implementing access control in application code.

Key policies:

- `trip`: public read via `share_token` when `is_public = true`; write by owner only
- `step`: public read only for `visibility = 'public'` steps on public trips
- `accommodation`: never publicly readable — owner only

---

## Data model

```
auth.users
    └── trip          (user_id → auth.users)
            └── step  (trip_id → trip)
                    ├── step_type  (step_type_id → step_type)
                    └── accommodation (step_id → step)
```

The `step_type` table is a reference table (cycling, train, hotel, campsite, etc.) seeded at schema creation and readable by anyone.

The `accommodation` table is intentionally separate from `step`: a step represents a journey leg or a stay, while accommodation holds the lodging details — including private fields — for overnight stops.

---

## Local setup

> Prerequisites: Node.js 18+, a Supabase project, npm.

```bash
git clone git@github.com:Candyfair/JourneyLog.git
cd JourneyLog
npm install
```

Create a `.env.local` file at the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the SQL schema against your Supabase project (Supabase dashboard → SQL editor):

```
supabase/create_tables_v1.sql
```

Start the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

---

## Development status

| Bloc | Scope                                                                          | Status     |
| ---- | ------------------------------------------------------------------------------ | ---------- |
| 1    | Project init, Supabase setup, SQL schema, TypeScript types, middleware         | ✓ Complete |
| 2    | Business services layer (`tripService`, `stepService`, `accommodationService`) | ✓ Complete |
| 3    | API route handlers (CRUD + public endpoint)                                    | Planned    |
| 4    | Pages and UI                                                                   | Planned    |

---

## Background

Started cycle touring in 2023. Built the original TravelPlan app to plan the first trip; JourneyLog is a ground-up rebuild with a proper stack, RLS-enforced privacy, and a cleaner architecture.
