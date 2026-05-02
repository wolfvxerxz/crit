import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const buildPrompt = (designContext: string): string => `You are Crit, an expert design critic. Analyse the design image provided and return a JSON critique. Be specific, blunt, and useful — no fluff. Reference what you actually see in the image.

${designContext ? `Designer's context: ${designContext}\n` : ''}

Return ONLY valid JSON in this exact shape (no markdown, no commentary):
{
  "overall_score": <0-100 integer>,
  "summary": "<one-sentence verdict, max 120 chars>",
  "dimensions": {
    "clarity": <0-100>,
    "hierarchy": <0-100>,
    "trust": <0-100>,
    "conversion": <0-100>
  },
  "issues": [
    {
      "severity": "critical|warning|minor",
      "title": "<short issue title, max 60 chars>",
      "area": "<UX area like Trust, Hierarchy, Clarity, Conversion>",
      "description": "<2 sentences max, specific to what you see>",
      "fix": "<one concrete actionable fix, 1-2 sentences>",
      "impact": "<estimated impact like '+15% conversion' or 'A/B testable'>"
    }
  ]
}

Score honestly. Most designs sit between 50-75. Below 40 means serious problems. Above 85 is rare. Output 3-5 issues, prioritised by severity.`;

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Server is not configured. Missing ANTHROPIC_API_KEY env variable.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { imageData, imageMime, designContext } = body;

    if (!imageData || !imageMime) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      );
    }

    if (!imageMime.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMime,
                data: imageData,
              },
            },
            {
              type: 'text',
              text: buildPrompt(designContext || ''),
            },
          ],
        },
      ],
    });

    const text = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim();

    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('[critique] error:', err);
    const message = err?.message || 'Failed to generate critique';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
