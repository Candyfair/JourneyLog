import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { getByUser, create } from '@/lib/services/tripService';
import { tripCreateSchema } from '@/lib/validations/schemas';

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const trips = await getByUser(supabase, user.id);
    return NextResponse.json(trips);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch trips', 500);
  }
}

export async function POST(request: Request) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'Invalid JSON body', 400);
  }

  const parsed = tripCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      parsed.error.issues[0].message,
      400,
    );
  }

  try {
    const trip = await create(supabase, user.id, {
      ...parsed.data,
      user_id: user.id,
    });
    return NextResponse.json(trip, { status: 201 });
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip', 500);
  }
}
