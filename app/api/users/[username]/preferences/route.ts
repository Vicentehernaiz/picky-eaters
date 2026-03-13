import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // Get user
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, is_public')
    .eq('username', username)
    .single();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (!user.is_public) return NextResponse.json({ error: 'Profile is private' }, { status: 403 });

  const { data: preferences, error } = await supabaseAdmin
    .from('user_food_preferences')
    .select('id, rating, intensity, notes, foods(name, emoji, category)')
    .eq('user_id', user.id)
    .eq('is_public', true)
    .order('rating');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ preferences });
}
