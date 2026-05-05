import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { update, remove } from '@/lib/services/accommodationService';
import { accommodationUpdateSchema } from '@/lib/validations/schemas';

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function parseId(raw: string): number | null {
  const id = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) {
    return errorResponse('BAD_REQUEST', 'Invalid accommodation id', 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'Invalid JSON body', 400);
  }

  const parsed = accommodationUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      parsed.error.issues[0].message,
      400,
    );
  }

  try {
    const accommodation = await update(supabase, id, parsed.data);
    return NextResponse.json(accommodation);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('No rows') || message.includes('PGRST116')) {
      return errorResponse('NOT_FOUND', 'Accommodation not found', 404);
    }
    return errorResponse(
      'INTERNAL_ERROR',
      'Failed to update accommodation',
      500,
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) {
    return errorResponse('BAD_REQUEST', 'Invalid accommodation id', 400);
  }

  try {
    await remove(supabase, id);
    return new Response(null, { status: 204 });
  } catch {
    return errorResponse(
      'INTERNAL_ERROR',
      'Failed to delete accommodation',
      500,
    );
  }
}
