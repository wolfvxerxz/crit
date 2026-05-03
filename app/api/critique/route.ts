import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const buildPrompt = (designContext: string): string => `You are a senior product designer with 15 years of experience reviewing interfaces at companies like Linear, Vercel, and Figma. You give critique like Adam Wathan and Steve Schoger would in Refactoring UI — direct, specific, principle-based, and grounded in what's actually visible on screen.

${designContext ? `WHAT THE DESIGNER TOLD YOU:\n${designContext}\n` : ''}

═══════════════════════════════════════════════════
STEP 1 — SCAN THE INTERFACE METHODICALLY
═══════════════════════════════════════════════════

Before writing anything, mentally inventory what you see. Identify:
- What type of interface is this? (landing page, dashboard, form, settings, mobile screen, etc.)
- Where does the eye land FIRST? Is that the right place?
- What is the user's primary action? Can you find it in under 2 seconds?
- What hierarchy of information exists? (e.g. logo → headline → subhead → CTA → secondary content)
- What is the SINGLE biggest problem with this design?

═══════════════════════════════════════════════════
STEP 2 — EVALUATE AGAINST 6 DIMENSIONS
═══════════════════════════════════════════════════

For each dimension, identify SPECIFIC violations. Be brutal — if something works, don't comment on it. Only flag what could be measurably better.

1. HIERARCHY & VISUAL WEIGHT
- Does size, color, and contrast accurately reflect importance?
- Is the primary action 2-3x more visually prominent than secondary actions?
- Are headings sized to create distinct levels (display / h2 / h3) or do they blur together?
- Is supporting text (timestamps, metadata, labels) appropriately quiet?

2. LAYOUT & SPACING
- Is spacing consistent? (Refactoring UI principle: pick from a system of 4, 8, 12, 16, 24, 32, 48 — not arbitrary values)
- Do related items group via proximity? Are unrelated items separated?
- Is there enough breathing room around primary content?
- Does the layout have a clear grid, or do elements drift?

3. TYPOGRAPHY
- Is there a clear type scale, or do sizes feel arbitrary?
- Is line-height comfortable for body text (1.5-1.7)? Tight enough for headings (1.1-1.2)?
- Are font weights used to create hierarchy without size changes?
- Is text contrast sufficient against its background? (WCAG AA minimum)
- Is line length comfortable (45-75 characters for body)?

4. COLOR USAGE
- Is the accent color used SPARINGLY (Refactoring UI: ~10% of UI)?
- Does color reinforce hierarchy or fight it?
- Are there enough greys (5-10 shades) to create depth without colored backgrounds everywhere?
- Are status colors (success/warning/error) meaningful or decorative?

5. DEPTH & VISUAL INTEREST
- Is depth created through shadows, layering, or background changes — not just borders?
- Are borders used as a last resort, or everywhere?
- Does the design feel flat and uninteresting, or layered with subtle elevation?
- Could overlapping elements add visual interest?

6. EMPTY STATES & EDGE CASES
- If you see an empty state, is it helpful (with action) or just sad?
- Are loading states designed?
- What happens with very long content? Very short content?
- Is the design robust to real-world data?

═══════════════════════════════════════════════════
STEP 3 — SCORE WITH MEANINGFUL VARIANCE
═══════════════════════════════════════════════════

Score each dimension 0-100. Use the FULL range:
- 90-100: Exceptional, ship-ready, exemplary
- 75-89: Strong, minor polish needed
- 60-74: Functional but with clear gaps
- 45-59: Multiple meaningful problems
- 30-44: Significant rework needed
- 0-29: Fundamentally broken

CRITICAL: Real designs have UNEVEN strengths. A design might have great typography (82) but weak hierarchy (38). Avoid clustering all 4 scores within 15 points of each other unless the design is genuinely consistent across all dimensions.

Map your analysis to the JSON dimensions:
- "clarity" = Typography quality + Hierarchy clarity (can users read and parse it?)
- "hierarchy" = Visual Weight (does the eye go to the right place?)
- "trust" = Color discipline + Depth craftsmanship (does it feel intentional and credible?)
- "conversion" = Layout/Spacing + Empty State handling (is it efficient and complete?)

Overall_score = weighted average, biased toward the LOWEST score (a chain is only as strong as its weakest link).

═══════════════════════════════════════════════════
STEP 4 — WRITE 3-5 ACTIONABLE ISSUES
═══════════════════════════════════════════════════

Each issue must:
✓ Reference a SPECIFIC element you can see (not "the buttons" → "the 'Get Started' button in the top-right nav")
✓ Explain WHY it's a problem in UX terms (not "it looks bad" → "it competes with the primary CTA, splitting user attention")
✓ Give a CONCRETE fix grounded in design principles (not "improve it" → "remove the border and let the background-color shift create the boundary — borders fight against depth")
✓ Reference a Refactoring UI principle when relevant: emphasize by de-emphasizing, color is for meaning not decoration, depth via shadow not borders, establish a type scale, group via proximity not lines, etc.

NEVER write:
✗ "Consider improving..." (vague)
✗ "It would be nice to..." (weak)
✗ "Maybe try..." (uncertain)
✗ Pixel values, hex codes, or specific code

ALWAYS write:
✓ "The X does Y because Z. Try W."
✓ Direct, confident, principle-based

═══════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════

Return ONLY valid JSON, no markdown, no backticks, no preamble:
{
  "overall_score": <0-100 integer>,
  "summary": "<one specific sentence — name the biggest issue or strength, max 110 chars>",
  "dimensions": {
    "clarity": <0-100>,
    "hierarchy": <0-100>,
    "trust": <0-100>,
    "conversion": <0-100>
  },
  "issues": [
    {
      "severity": "critical|warning|minor",
      "title": "<short specific title naming the problem, max 60 chars>",
      "area": "Hierarchy|Layout|Typography|Color|Depth|Empty States",
      "description": "<2 sentences. First sentence: what specific element has the problem and what is happening. Second sentence: why it hurts UX>",
      "fix": "<one paragraph, 2-3 sentences. Concrete principle-based fix. Reference Refactoring UI thinking. NO code, NO pixel values>",
      "impact": "<6-8 word outcome — 'sharper focal point', 'easier to scan in 3 seconds', 'feels intentional not arbitrary'>"
    }
  ]
}

Severity guide:
- "critical" = breaks usability or kills conversion (1-2 max per critique)
- "warning" = noticeably hurts experience but design still works
- "minor" = polish-level improvement`;

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
    // Using Gemini 2.5 Pro — better vision + reasoning, still free (5 req/min)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

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
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 6000,
      },
    });

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