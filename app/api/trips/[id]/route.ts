import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { getById, update, remove } from '@/lib/services/tripService';
import { tripUpdateSchema } from '@/lib/validations/schemas';

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function parseId(raw: string): number | null {
  const id = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

export async function GET(
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
    return errorResponse('BAD_REQUEST', 'Invalid trip id', 400);
  }

  try {
    const trip = await getById(supabase, id, user.id);
    if (!trip) {
      return errorResponse('NOT_FOUND', 'Trip not found', 404);
    }
    return NextResponse.json(trip);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch trip', 500);
  }
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
    return errorResponse('BAD_REQUEST', 'Invalid trip id', 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'Invalid JSON body', 400);
  }

  const parsed = tripUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      parsed.error.issues[0].message,
      400,
    );
  }

  try {
    const trip = await update(supabase, id, user.id, parsed.data);
    if (!trip) {
      return errorResponse('NOT_FOUND', 'Trip not found', 404);
    }
    return NextResponse.json(trip);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to update trip', 500);
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
    return errorResponse('BAD_REQUEST', 'Invalid trip id', 400);
  }

  try {
    await remove(supabase, id, user.id);
    return new Response(null, { status: 204 });
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to delete trip', 500);
  }
}
