import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { getByStep, create } from '@/lib/services/accommodationService';
import { accommodationCreateSchema } from '@/lib/validations/schemas';

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
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

  const parsed = accommodationCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      parsed.error.issues[0].message,
      400,
    );
  }

  try {
    const accomodation = await getByStep(supabase, parsed.data.step_id);
    if (accomodation) {
      return errorResponse(
        'CONFLICT',
        'The step already has an accommodation',
        409,
      );
    }
  } catch {
    return errorResponse(
      'INTERNAL_ERROR',
      'Failed to check existing accommodation',
      500,
    );
  }

  try {
    const accommodation = await create(supabase, parsed.data);
    return NextResponse.json(accommodation, { status: 201 });
  } catch {
    return errorResponse(
      'INTERNAL_ERROR',
      'Failed to create accommodation',
      500,
    );
  }
}
