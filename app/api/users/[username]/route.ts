import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, username, display_name, bio, avatar_url, is_public, created_at')
    .eq('username', username)
    .single();

  if (error || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (!user.is_public) return NextResponse.json({ error: 'Profile is private' }, { status: 403 });

  return NextResponse.json({ user });
}
