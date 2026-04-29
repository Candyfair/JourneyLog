import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { getByShareToken } from '@/lib/services/tripService';

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ share_token: string }> },
) {
  const supabase = await createServerClient();

  const { share_token } = await params;

  try {
    const trip = await getByShareToken(supabase, share_token);
    return NextResponse.json(trip);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('No rows') || message.includes('PGRST116')) {
      return errorResponse('NOT_FOUND', 'Trip not found or not public', 404);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch trip', 500);
  }
}
