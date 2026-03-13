import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, supabaseAdmin } from '@/src/lib/supabase';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authUser = await getUserFromToken(token);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return NextResponse.json({ user });
}
