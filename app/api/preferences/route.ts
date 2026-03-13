import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, supabaseAdmin } from '@/src/lib/supabase';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authUser = await getUserFromToken(token);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('user_food_preferences')
    .select('*, foods(id, name, emoji, category)')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ preferences: data });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authUser = await getUserFromToken(token);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { foodId, foodName, foodEmoji, rating, intensity, notes } = await req.json();
    if (!rating) return NextResponse.json({ error: 'Rating is required' }, { status: 400 });

    let resolvedFoodId = foodId;

    // If no foodId provided, create a custom food entry
    if (!resolvedFoodId && foodName) {
      const { data: existing } = await supabaseAdmin
        .from('foods')
        .select('id')
        .ilike('name', foodName)
        .single();

      if (existing) {
        resolvedFoodId = existing.id;
      } else {
        const { data: newFood, error: foodErr } = await supabaseAdmin
          .from('foods')
          .insert({ name: foodName.toLowerCase(), emoji: foodEmoji ?? '🍴', category: 'other' })
          .select('id')
          .single();
        if (foodErr) return NextResponse.json({ error: foodErr.message }, { status: 500 });
        resolvedFoodId = newFood.id;
      }
    }

    if (!resolvedFoodId) return NextResponse.json({ error: 'Food is required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('user_food_preferences')
      .upsert({
        user_id: authUser.id,
        food_id: resolvedFoodId,
        rating,
        intensity: intensity ?? 3,
        notes: notes ?? '',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,food_id' })
      .select('*, foods(id, name, emoji, category)')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ preference: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
