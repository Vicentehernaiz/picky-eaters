import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, supabaseAdmin } from '@/src/lib/supabase';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authUser = await getUserFromToken(token);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { rating, intensity, notes } = await req.json();

  const { data, error } = await supabaseAdmin
    .from('user_food_preferences')
    .update({ rating, intensity, notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', authUser.id)
    .select('*, foods(id, name, emoji, category)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ preference: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authUser = await getUserFromToken(token);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('user_food_preferences')
    .delete()
    .eq('id', id)
    .eq('user_id', authUser.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
