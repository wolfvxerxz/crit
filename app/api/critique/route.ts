import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const buildPrompt = (designContext: string): string => `You are an expert UI designer providing thoughtful, specific feedback following the design principles from Refactoring UI by Adam Wathan and Steve Schoger. Analyse the screenshot and return a structured JSON critique.

${designContext ? `Designer's context: ${designContext}\n` : ''}

ANALYSIS FRAMEWORK — evaluate the design across these 6 dimensions:

1. HIERARCHY & VISUAL WEIGHT — Does the design communicate importance through size, color, and contrast? Are primary actions clearly emphasized? Is secondary information appropriately de-emphasized?

2. LAYOUT & SPACING — Is there enough white space? Are there spacing inconsistencies? Do related elements have appropriate proximity? Are there areas too crowded or too empty?

3. TYPOGRAPHY — Is text hierarchy clear? Are font sizes appropriate and consistent? Is line height and letter spacing optimized? Could font weights be used more effectively?

4. COLOR USAGE — Are colors used consistently and purposefully? Is there appropriate contrast? Are accent colors drawing attention to the right elements? Could colors create better hierarchy?

5. DEPTH & VISUAL INTEREST — Could shadows or layering improve it? Are backgrounds utilised well? Are borders overused where spacing or background changes would work better?

6. EMPTY STATES & EDGE CASES — How could empty states be improved? Are there edge cases not accounted for?

SCORING — Map the 4 dimension scores like this:
- "clarity" = score for Typography + Hierarchy combined (is the design readable and well-organised?)
- "hierarchy" = score for Visual Weight (does the eye know where to go?)
- "trust" = score for Color Usage + Depth (does it feel polished and credible?)
- "conversion" = score for Layout & Spacing + Empty States (is it efficient and complete?)

Score each dimension 0-100 INDEPENDENTLY based on what you actually see. Vary the scores realistically — most real designs score wildly differently across dimensions (e.g. 85 typography, 45 hierarchy, 70 color, 30 spacing). Avoid clustering all four scores in the same range. Overall_score should be the weighted average, leaning toward the lowest dimensions.

Return ONLY valid JSON, no markdown, no backticks:
{
  "overall_score": <0-100 integer>,
  "summary": "<one specific sentence verdict referencing the actual design, max 110 chars>",
  "dimensions": {
    "clarity": <0-100>,
    "hierarchy": <0-100>,
    "trust": <0-100>,
    "conversion": <0-100>
  },
  "issues": [
    {
      "severity": "critical|warning|minor",
      "title": "<specific issue, max 60 chars>",
      "area": "Hierarchy|Layout|Typography|Color|Depth|Empty States",
      "description": "<2 sentences referencing exactly what you see in the screenshot — the specific button, heading, section, color, etc>",
      "fix": "<one concrete actionable suggestion based on Refactoring UI principles. NO pixel values or code. Focus on visual design principles>",
      "impact": "<brief outcome like 'sharper focal point', 'easier scanning', 'feels more credible'>"
    }
  ]
}

CRITICAL RULES:
- Output 3-5 issues, prioritised by impact
- Each issue must reference SPECIFIC elements you see (not "the buttons" but "the orange Sign Up button next to the email field")
- NO generic advice ("improve hierarchy") — only specific, actionable suggestions ("the secondary 'Learn More' link competes with the primary CTA — try making it a plain text link without the box")
- Reference Refactoring UI principles where relevant (de-emphasize secondary info, use color sparingly, establish a spacing/size system, depth through subtle shadows not borders, etc.)
- Vary your scores meaningfully — same scores every time means lazy analysis
- Be honest and direct, not encouraging`;

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

    const requestBody = JSON.stringify({
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
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 4000,
      },
    });

    // Retry on 503 (overloaded) or 429 (rate limit) with exponential backoff
    let geminiResponse: Response | null = null;
    let lastError = '';
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      geminiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });

      if (geminiResponse.ok) break;

      lastError = await geminiResponse.text();
      console.error(`Attempt ${attempt} failed:`, geminiResponse.status, lastError);

      if (geminiResponse.status !== 503 && geminiResponse.status !== 429) {
        return Response.json(
          { error: `Gemini API error ${geminiResponse.status}: ${lastError}` },
          { status: 502 }
        );
      }

      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      return Response.json(
        { error: 'Gemini is overloaded right now. Try again in a minute.' },
        { status: 503 }
      );
    }

    const geminiData = await geminiResponse.json();
    const candidate = geminiData?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const rawText = candidate?.content?.parts?.[0]?.text;

    if (!rawText || typeof rawText !== 'string') {
      console.error('No text in response. Finish reason:', finishReason);
      return Response.json(
        {
          error: `Model returned no text (reason: ${finishReason || 'unknown'}). Try a different image.`,
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