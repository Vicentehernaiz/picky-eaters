import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCAN_PROMPT = `You are a food expert analyzing an image. The image may show a dish, a restaurant menu, or a recipe.

Extract ALL individual food ingredients and items you can identify.

Return ONLY a JSON array with this exact format:
[
  { "name": "tomato", "emoji": "🍅", "category": "vegetable", "confidence": 0.95 },
  { "name": "mozzarella", "emoji": "🧀", "category": "dairy", "confidence": 0.90 }
]

Rules:
- Extract individual ingredients, not dish names (e.g. "egg", "flour", "sugar" — not "cake")
- Use simple, common names in lowercase
- Categories: protein, vegetable, fruit, dairy, seafood, spice, carb, other
- confidence: 0.0 to 1.0
- Return minimum 1, maximum 30 items
- Return ONLY the JSON array, no other text`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'imageBase64 and mimeType are required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
          { type: 'text', text: SCAN_PROMPT },
        ],
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
    const ingredients = JSON.parse(text);

    return NextResponse.json({ ingredients });
  } catch (err: any) {
    console.error('Scan error:', err);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
