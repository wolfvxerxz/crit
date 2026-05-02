'use client';

import Link from 'next/link';
import { ORANGE, ORANGE_DARK, BG, SURFACE, BORDER, TEXT, TEXT_MUTED, TEXT_DIM } from '@/lib/colors';

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: ORANGE, flexShrink: 0 }}>
    <path d="M3 7l3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const X = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: TEXT_DIM, flexShrink: 0 }}>
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ArrowRight = ({ color = '#fff' }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default function LandingPage() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', border: `0.5px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 60, borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>crit<span style={{ color: ORANGE }}>.</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['How it works', 'Pricing', 'Examples', 'Changelog'].map(l => (
              <span key={l} style={{ fontSize: 13, color: TEXT_MUTED, padding: '6px 14px', borderRadius: 1000, cursor: 'pointer', letterSpacing: '-0.01em' }}>{l}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ fontSize: 13, color: TEXT_MUTED, padding: '7px 14px', borderRadius: 1000, cursor: 'pointer', letterSpacing: '-0.01em' }}>Log in</Link>
            <Link href="/login" style={{ fontSize: 13, color: '#fff', background: ORANGE, padding: '7px 16px', borderRadius: 1000, cursor: 'pointer', letterSpacing: '-0.01em' }}>Run a free critique</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ padding: '80px 32px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px 5px 8px', background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 1000, fontSize: 12, color: TEXT_MUTED, marginBottom: 28, letterSpacing: '-0.01em' }}>
            <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', background: ORANGE_DARK, color: ORANGE, borderRadius: 1000, letterSpacing: '0.04em' }}>NEW</span>
            Now scoring Figma files directly via link
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.04, letterSpacing: '-2.5px', maxWidth: 920, marginBottom: 20 }}>
            Get design feedback in <span style={{ color: ORANGE }}>30 seconds</span>. Not five days.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: TEXT_MUTED, maxWidth: 560, marginBottom: 36, letterSpacing: '-0.01em' }}>
            Drop in a Figma file or screenshot. Crit scores it across clarity, hierarchy, trust, and conversion — and tells you exactly what to fix first.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, background: ORANGE, color: '#fff', borderRadius: 1000, padding: '12px 24px', fontSize: 14, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              Run a free critique <ArrowRight />
            </Link>
            <Link href="#how" style={{ display: 'flex', alignItems: 'center', gap: 6, background: SURFACE, border: `0.5px solid ${BORDER}`, color: TEXT_MUTED, borderRadius: 1000, padding: '12px 24px', fontSize: 14, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              See a sample report
            </Link>
          </div>
        </section>

        {/* Logos */}
        <section style={{ padding: '36px 32px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500 }}>2,400+ critiques run last month by</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            {['extsy', 'webserv', 'nordeus', 'amenify', 'bobos', 'velora'].map(l => (
              <span key={l} style={{ fontSize: 15, color: TEXT_DIM, fontWeight: 500, letterSpacing: '-0.02em' }}>{l}</span>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section style={{ padding: '100px 32px', borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>The Problem</div>
            <h2 style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 16 }}>Design feedback either takes a week or it's useless.</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: TEXT_MUTED, maxWidth: 580, margin: '0 auto', letterSpacing: '-0.01em' }}>
              You ship something, post it in a Slack group, and wait. By the time real critique arrives, you've already moved on. Momentum dies in the gap.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 1200, margin: '0 auto', border: `0.5px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
            {[
              { num: '01 — Slow loops', title: '3–5 day turnaround for one round of feedback.', desc: "Designers are booked. Senior friends are busy. Your product manager has opinions but no time. You're left guessing whether the hero works while shipping the next one." },
              { num: '02 — Vague critique', title: '"Looks good" doesn\'t tell you what to fix.', desc: "Most feedback is vibes-based. You walk away knowing something's off but not what's failing or why. Without specificity, you can't iterate — only second-guess." },
              { num: '03 — No measurement', title: "You can't tell if version 2 is better than version 1.", desc: 'Without a score or framework, every iteration is a coin flip. You ship, hope, and hope again. Crit gives you a number that moves — so you know progress is real.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '36px 32px', borderRight: i < 2 ? `0.5px solid ${BORDER}` : 'none' }}>
                <div style={{ fontSize: 11, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 18 }}>{p.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.5px', marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="how" style={{ padding: '100px 32px', borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>What Crit does</div>
            <h2 style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 16 }}>The whole feedback loop, compressed.</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: TEXT_MUTED, maxWidth: 580, margin: '0 auto', letterSpacing: '-0.01em' }}>
              From "I think this hero is fine" to "I know exactly what's wrong and how to fix it" — in about the time it takes to refill your coffee.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 1200, margin: '0 auto', border: `0.5px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
            {[
              { title: '30-second scoring.', desc: 'Drop a Figma link, screenshot, or paste a URL. Crit returns an overall score plus dimensional breakdowns — clarity, hierarchy, trust, conversion — in under a minute.', tag: 'The core loop' },
              { title: 'Pinpointed flags.', desc: 'Every issue is numbered and pinned directly on your design. Click a flag to see severity, conversion impact, and an exact fix you can apply or skip.', tag: 'Pixel-precise' },
              { title: 'Brand-aware critique.', desc: 'Upload your tokens, fonts, and voice once. Every fix Crit suggests respects your brand — no more "use my colors" prompts five times in a row.', tag: 'Set up once' },
              { title: 'Score history per project.', desc: 'See how a design evolves over revisions. v1 hit 58. v2 hit 71. v3 hit 84. Track real progress instead of guessing whether you\'re getting closer.', tag: 'Measurable progress' },
            ].map((f, i) => (
              <div key={i} style={{ padding: 40, borderRight: i % 2 === 0 ? `0.5px solid ${BORDER}` : 'none', borderBottom: i < 2 ? `0.5px solid ${BORDER}` : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, background: ORANGE_DARK, border: `0.5px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ORANGE, marginBottom: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" /><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.5px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>{f.desc}</p>
                <span style={{ display: 'inline-flex', fontSize: 11, color: ORANGE, background: ORANGE_DARK, padding: '3px 9px', borderRadius: 1000, letterSpacing: '-0.01em', width: 'fit-content', marginTop: 4 }}>{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section style={{ padding: '100px 32px', borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Why Crit</div>
            <h2 style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 16 }}>The honest comparison.</h2>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto', border: `0.5px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                { label: 'Generic AI', name: 'ChatGPT / Claude', us: false },
                { label: 'Old way', name: 'Slack / friends', us: false },
                { label: 'New way', name: 'crit.', us: true },
              ].map((h, i) => (
                <div key={i} style={{ padding: 24, borderRight: i < 2 ? `0.5px solid ${BORDER}` : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>{h.label}</div>
                  <div style={{ fontSize: 16, color: h.us ? ORANGE : TEXT, fontWeight: 500, letterSpacing: '-0.01em' }}>{h.name}</div>
                </div>
              ))}
            </div>
            {[
              ['No scoring framework', '"Looks good" energy', '0–100 score across 4 dimensions'],
              ['Instant', '3–5 days minimum', '30 seconds, every time'],
              ['Generic suggestions', 'Vague vibes', 'Pinned flags + exact fixes'],
              ["Doesn't know your brand", 'Knows your brand', 'Tokens, fonts, voice on file'],
              ['No version tracking', 'Threads die in Slack', 'Score progression per project'],
              ['Free / cheap', '€3,500–8,000 / mo', '€39 / month, cancel anytime'],
            ].map((row, i) => {
              const checks = [
                [false, false, true], [true, false, true], [false, false, true],
                [false, true, true], [false, false, true], [true, false, true]
              ][i];
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: `0.5px solid ${BORDER}` }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{ padding: '18px 24px', borderRight: j < 2 ? `0.5px solid ${BORDER}` : 'none', fontSize: 13, color: j === 2 ? TEXT : TEXT_MUTED, display: 'flex', alignItems: 'center', gap: 10, background: j === 2 ? 'rgba(255,85,18,0.04)' : 'transparent' }}>
                      {checks[j] ? <Check /> : <X />}
                      {cell}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '100px 32px', borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>FAQ</div>
            <h2 style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 16 }}>Things people ask before running their first critique.</h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto', border: `0.5px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
            {[
              { q: 'How does Crit actually score a design?', a: 'Crit evaluates four dimensions weighted by their impact on real outcomes: Clarity, Hierarchy, Trust, and Conversion. Each is scored 0–100 against benchmarks from 12,000+ analysed designs.' },
              { q: 'What can I upload to Crit?', a: 'Figma files (paste a link), screenshots (PNG/JPG), live URLs, and full Figma frames. Sketch and Framer integrations are in beta.' },
              { q: 'Is this just ChatGPT with a wrapper?', a: 'No. Crit uses a vision-language model fine-tuned on design critique, paired with a scoring framework built from real conversion data.' },
              { q: 'Will it replace my designer?', a: "Probably not — and we don't want it to. Crit replaces the awkward 5-day Slack thread, not the designer." },
              { q: 'Is my data private?', a: "Yes. Your designs and tokens are private to your workspace. We don't train on your data, and you can delete everything with one click." },
              { q: 'What if I don\'t like it?', a: 'Your first critique is free, no card required. Cancel any time — no questions, no awkward "are you sure" emails.' },
            ].map((item, i, arr) => (
              <div key={i} style={{ padding: '24px 28px', borderBottom: i < arr.length - 1 ? `0.5px solid ${BORDER}` : 'none' }}>
                <div style={{ fontSize: 15, color: TEXT, letterSpacing: '-0.01em', fontWeight: 500, marginBottom: 12 }}>{item.q}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '100px 32px', textAlign: 'center', borderBottom: `0.5px solid ${BORDER}` }}>
          <h2 style={{ fontSize: 48, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 16, maxWidth: 760, margin: '0 auto 16px' }}>Stop guessing. Run your first critique in 30 seconds.</h2>
          <p style={{ fontSize: 16, color: TEXT_MUTED, maxWidth: 480, margin: '0 auto 32px', letterSpacing: '-0.01em' }}>Free, no card, no nonsense. Drop in a screenshot and see your score before this page finishes loading.</p>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ORANGE, color: '#fff', borderRadius: 1000, padding: '12px 24px', fontSize: 14, cursor: 'pointer', letterSpacing: '-0.01em' }}>
            Run a free critique <ArrowRight />
          </Link>
        </section>

        {/* Footer */}
        <footer style={{ padding: '40px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, letterSpacing: '-0.01em' }}>crit<span style={{ color: ORANGE }}>.</span></div>
            <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6, maxWidth: 280, letterSpacing: '-0.01em' }}>
              Real design feedback in 30 seconds. Built for founders, indie hackers, and designers who actually want to know what's broken.
            </div>
          </div>
          {[
            { title: 'Product', links: ['How it works', 'Pricing', 'Examples', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Resources', links: ['Documentation', 'Scoring framework', 'Status', 'Privacy'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: TEXT_MUTED, padding: '5px 0', cursor: 'pointer', letterSpacing: '-0.01em' }}>{l}</div>
              ))}
            </div>
          ))}
        </footer>
        <div style={{ padding: '24px 32px', borderTop: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: TEXT_DIM, letterSpacing: '-0.01em' }}>
          <span>© 2026 crit. All rights reserved.</span>
          <span>30 seconds to a better design.</span>
        </div>
      </div>
    </div>
  );
}
