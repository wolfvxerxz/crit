'use client';

import { ORANGE, ORANGE_DARK, BG, SURFACE, BORDER, TEXT, TEXT_MUTED, TEXT_DIM, scoreColor, severityColor } from '@/lib/colors';
import type { Critique } from '@/lib/storage';

interface CritiqueResultProps {
  critique: Critique;
  onClose: () => void;
}

export default function CritiqueResult({ critique, onClose }: CritiqueResultProps) {
  const sc = scoreColor(critique.overall_score);

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
      <div className="fade-in" style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: ORANGE, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>
              Critique complete
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em' }}>Your design, scored.</h1>
          </div>
          <button onClick={onClose} style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 1000, padding: '8px 16px', color: TEXT_MUTED, fontSize: 12, cursor: 'pointer', letterSpacing: '-0.01em' }}>
            Done
          </button>
        </div>

        {critique.imagePreview && (
          <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '10px 14px', borderBottom: `0.5px solid ${BORDER}`, fontSize: 11, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>
              Your upload
            </div>
            <div style={{ padding: 16, background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 240, overflow: 'hidden' }}>
              <img src={critique.imagePreview} alt="Uploaded design" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} />
            </div>
          </div>
        )}

        <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${sc}`, background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500, color: sc, letterSpacing: '-0.02em', flexShrink: 0 }}>
              {critique.overall_score}
            </div>
            <div>
              <div style={{ fontSize: 16, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 4, lineHeight: 1.4 }}>
                {critique.summary}
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>
                {critique.issues.length} issue{critique.issues.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, paddingTop: 14, borderTop: `0.5px solid ${BORDER}` }}>
            {(Object.entries(critique.dimensions) as [string, number][]).map(([key, val]) => {
              const c = scoreColor(val);
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: TEXT_MUTED, letterSpacing: '-0.01em', textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{val}</span>
                  </div>
                  <div style={{ height: 3, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: 3, width: `${val}%`, background: c, borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>
            {critique.issues.length} issue{critique.issues.length !== 1 ? 's' : ''} found
          </div>
          {critique.issues.map((issue, i) => (
            <div
              key={i}
              style={{
                background: SURFACE,
                border: `0.5px solid ${issue.severity === 'critical' ? 'rgba(255,85,18,0.3)' : BORDER}`,
                borderRadius: 6,
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: severityColor(issue.severity),
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, gap: 10 }}>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em' }}>{issue.title}</div>
                    <div style={{ fontSize: 10, color: TEXT_DIM, background: BG, padding: '2px 7px', borderRadius: 1000, border: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
                      {issue.area}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.6, letterSpacing: '-0.01em', marginBottom: 8 }}>
                    {issue.description}
                  </div>
                  <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: '8px 10px', marginBottom: 6 }}>
                    <div style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>
                      Suggested fix
                    </div>
                    <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5, letterSpacing: '-0.01em' }}>{issue.fix}</div>
                  </div>
                  <span style={{ display: 'inline-flex', fontSize: 10, color: ORANGE, background: ORANGE_DARK, padding: '2px 8px', borderRadius: 1000, letterSpacing: '-0.01em' }}>
                    {issue.severity} · {issue.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
