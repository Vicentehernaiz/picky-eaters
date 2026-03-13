import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, username, displayName } = await req.json();
    if (!userId || !email || !username || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check username uniqueness
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const { error } = await supabaseAdmin.from('users').insert({
      id: userId,
      email,
      username,
      display_name: displayName,
    });

    if (error) {
      console.error('Register error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
