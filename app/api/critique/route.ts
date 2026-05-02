import { NextRequest } from 'next/server';

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

  if (!imageMime.startsWith('image/')) {
    return Response.json({ error: 'File must be an image' }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Call Gemini 1.5 Flash — free tier, supports vision
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
          throw new Error(`Gemini API error ${geminiResponse.status}: ${errText}`);
        }

        const geminiData = await geminiResponse.json();

        const rawText =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const cleaned = rawText
          .replace(/^```json\s*/i, '')
          .replace(/```\s*$/, '')
          .trim();

        const parsed = JSON.parse(cleaned);

        controller.enqueue(
          encoder.encode('\n\n__RESULT__' + JSON.stringify(parsed))
        );
        controller.close();
      } catch (err: any) {
        console.error('[critique] error:', err);
        controller.enqueue(
          encoder.encode(
            '\n\n__ERROR__' +
              JSON.stringify({ error: err?.message || 'Failed to generate critique' })
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Accel-Buffering': 'no',
    },
  });
}
