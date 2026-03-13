import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, supabaseAdmin } from '@/src/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authUser = await getUserFromToken(token);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  const { data: prefs } = await supabaseAdmin
    .from('user_food_preferences')
    .select('rating, foods(name, category)')
    .eq('user_id', authUser.id);

  const positive = prefs?.filter(p => ['love', 'like'].includes(p.rating)).map(p => (p.foods as any)?.name) ?? [];
  const negative = prefs?.filter(p => ['hate', 'dislike', 'allergy'].includes(p.rating)).map(p => (p.foods as any)?.name) ?? [];

  const prompt = `Based on these food preferences, suggest 5 foods the user has NOT yet rated that they would likely enjoy.

USER LOVES/LIKES: ${JSON.stringify(positive)}
USER DISLIKES/HATES: ${JSON.stringify(negative)}

Return ONLY this JSON array:
[{"food":"name","emoji":"🥭","category":"fruit","reason":"short reason why they'd like it"}]`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
    const suggestions = JSON.parse(text);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 });
  }
}
