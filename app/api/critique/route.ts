import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const buildPrompt = (designContext: string): string => `You are Crit, an expert design critic. Analyse the design image and return a JSON critique. Be specific.

${designContext ? `Designer's context: ${designContext}\n` : ''}

Return ONLY valid JSON, no markdown, no backticks, no extra text. Keep all string values short and concise.

Schema:
{
  "overall_score": 72,
  "summary": "one sentence verdict, max 100 chars",
  "dimensions": {
    "clarity": 80,
    "hierarchy": 70,
    "trust": 60,
    "conversion": 75
  },
  "issues": [
    {
      "severity": "critical",
      "title": "short issue title, max 50 chars",
      "area": "Trust",
      "description": "two short sentences max",
      "fix": "one short sentence",
      "impact": "short phrase like +15% conversion"
    }
  ]
}

Rules:
- Score honestly: 50-75 typical, below 40 serious, above 85 rare
- Output 3 issues maximum, prioritised by severity
- Keep each string value brief and direct
- Do not include any text outside the JSON object`;

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
          maxOutputTokens: 4000,
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

    // Defensive extraction — Gemini sometimes returns weird shapes
    const candidate = geminiData?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const rawText = candidate?.content?.parts?.[0]?.text;

    if (!rawText || typeof rawText !== 'string') {
      console.error('No text in response. Finish reason:', finishReason);
      console.error('Full response:', JSON.stringify(geminiData));
      return Response.json(
        {
          error: `Model returned no text (reason: ${finishReason || 'unknown'}). Try a different image or add more context.`,
        },
        { status: 502 }
      );
    }

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Parse failed. Raw text:', cleaned);
      return Response.json(
        { error: 'Model output was incomplete. Try again.' },
        { status: 502 }
      );
    }

    return Response.json(parsed);

  } catch (err: any) {
    console.error('[critique] error:', err);
    return Response.json(
      { error: err?.message || 'Failed to generate critique' },
      { status: 500 }
    );
  }
}