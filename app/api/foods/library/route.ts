import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('foods')
    .select('id, name, emoji, category, tags', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name');

  if (search) query = query.ilike('name', `%${search}%`);
  if (category && category !== 'all') query = query.eq('category', category);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ foods: data, total: count, page, limit });
}
