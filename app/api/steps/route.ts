import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { create } from '@/lib/services/stepService';
import { stepCreateSchema } from '@/lib/validations/schemas';

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

  const parsed = stepCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      parsed.error.issues[0].message,
      400,
    );
  }

  try {
    const step = await create(supabase, parsed.data);
    return NextResponse.json(step, { status: 201 });
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create step', 500);
  }
}
