import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const buildPrompt = (designContext: string): string => `You are Crit, an expert design critic. Analyse the design image and return a JSON critique. Be specific and reference what you actually see.

${designContext ? `Designer's context: ${designContext}\n` : ''}

Return ONLY valid JSON, no markdown, no backticks, no extra text:
{
  "overall_score": <0-100>,
  "summary": "<one sentence, max 120 chars>",
  "dimensions": {
    "clarity": <0-100>,
    "hierarchy": <0-100>,
    "trust": <0-100>,
    "conversion": <0-100>
  },
  "issues": [
    {
      "severity": "critical|warning|minor",
      "title": "<max 60 chars>",
      "area": "<Trust|Hierarchy|Clarity|Conversion>",
      "description": "<2 sentences, specific to what you see>",
      "fix": "<one concrete fix, 1-2 sentences>",
      "impact": "<e.g. '+15% conversion' or 'reduces bounce'>"
    }
  ]
}

Score honestly: 50-75 is typical. Below 40 = serious problems. Above 85 = rare. Give 3-5 issues by severity.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'Missing GOOGLE_AI_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { imageData, imageMime, designContext } = body;

  if (!imageData || !imageMime) {
    return Response.json({ error: 'Missing image data' }, { status: 400 });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: imageMime,
                  data: imageData,
                },
              },
              {
                text: buildPrompt(designContext || ''),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini error:', errText);
      return Response.json(
        { error: `Gemini API error ${geminiResponse.status}: ${errText}` },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (err: any) {
    console.error('[critique] error:', err);
    return Response.json(
      { error: err?.message || 'Failed to generate critique' },
      { status: 500 }
    );
  }
}