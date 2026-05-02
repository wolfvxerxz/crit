'use client';

import { ORANGE, ORANGE_DARK, BG, SURFACE, BORDER, TEXT, TEXT_MUTED, TEXT_DIM, scoreColor } from '@/lib/colors';
import { timeAgo, type Critique } from '@/lib/storage';

// ===== Critiques (home) =====
interface CritiquesViewProps {
  history: Critique[];
  onOpen: (c: Critique) => void;
  onNew: () => void;
}

export function CritiquesView({ history, onOpen, onNew }: CritiquesViewProps) {
  const recent = history.slice(0, 6);

  return (
    <div style={{ padding: 32, overflowY: 'auto', height: '100%' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: ORANGE, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>
              Welcome back
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em' }}>
              Ready to score a design?
            </h1>
          </div>
          <button onClick={onNew} style={{ background: ORANGE, border: 'none', borderRadius: 1000, padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            New critique
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {recent.length === 0 ? (
          <div style={{ background: SURFACE, border: `1.5px dashed ${BORDER}`, borderRadius: 8, padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 16, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 6 }}>
              No critiques yet
            </div>
            <div style={{ fontSize: 13, color: TEXT_MUTED, letterSpacing: '-0.01em', marginBottom: 18 }}>
              Drop in a design to get your first score in 30 seconds.
            </div>
            <button onClick={onNew} style={{ background: ORANGE, border: 'none', borderRadius: 1000, padding: '10px 22px', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Run your first critique
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
              Recent critiques · {history.length}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {recent.map(c => {
                const sc = scoreColor(c.overall_score);
                return (
                  <div
                    key={c.id}
                    onClick={() => onOpen(c)}
                    style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 14, cursor: 'pointer', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = TEXT_DIM)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    {c.imagePreview && (
                      <div style={{ height: 100, marginBottom: 10, borderRadius: 4, overflow: 'hidden', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `0.5px solid ${BORDER}` }}>
                        <img src={c.imagePreview} alt="" style={{ maxWidth: '100%', maxHeight: 100, display: 'block' }} />
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1.5px solid ${sc}`, background: `${sc}15`, color: sc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                        {c.overall_score}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.summary.slice(0, 50)}{c.summary.length > 50 ? '...' : ''}
                        </div>
                        <div style={{ fontSize: 10, color: TEXT_DIM, marginTop: 2 }}>
                          {c.issues.length} issues · {timeAgo(c.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===== Projects =====
export function ProjectsView({ history }: { history: Critique[] }) {
  const avg = history.length ? Math.round(history.reduce((a, c) => a + c.overall_score, 0) / history.length) : 0;
  const issues = history.reduce((a, c) => a + c.issues.length, 0);

  return (
    <div style={{ padding: 32, overflowY: 'auto', height: '100%' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em', marginBottom: 24 }}>Projects</h1>
        <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 }}>
            Workspace stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 4 }}>Total critiques</div>
              <div style={{ fontSize: 24, color: TEXT, fontWeight: 500, letterSpacing: '-0.02em' }}>{history.length}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 4 }}>Average score</div>
              <div style={{ fontSize: 24, color: ORANGE, fontWeight: 500, letterSpacing: '-0.02em' }}>{avg || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 4 }}>Issues found</div>
              <div style={{ fontSize: 24, color: TEXT, fontWeight: 500, letterSpacing: '-0.02em' }}>{issues}</div>
            </div>
          </div>
        </div>
        <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 6 }}>
            Multi-project organisation
          </div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>
            Group critiques by project — coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== History =====
interface HistoryViewProps {
  history: Critique[];
  onOpen: (c: Critique) => void;
}

export function HistoryView({ history, onOpen }: HistoryViewProps) {
  return (
    <div style={{ padding: 32, overflowY: 'auto', height: '100%' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em', marginBottom: 24 }}>History</h1>
        {history.length === 0 ? (
          <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 60, textAlign: 'center', color: TEXT_MUTED, fontSize: 13, letterSpacing: '-0.01em' }}>
            No critiques yet. Run one from the Critiques tab.
          </div>
        ) : (
          <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
            {history.map((c, i) => {
              const sc = scoreColor(c.overall_score);
              return (
                <div
                  key={c.id}
                  onClick={() => onOpen(c)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 80px',
                    gap: 14,
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: i < history.length - 1 ? `0.5px solid ${BORDER}` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${sc}`, background: `${sc}15`, color: sc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
                    {c.overall_score}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.summary}
                    </div>
                    <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>
                      {c.issues.length} issues · clarity {c.dimensions.clarity} · trust {c.dimensions.trust}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_DIM, textAlign: 'right' }}>{timeAgo(c.timestamp)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Brand Kit =====
export function BrandKitView() {
  const colors = [
    { n: 'Accent', h: ORANGE },
    { n: 'Background', h: '#111111' },
    { n: 'Surface', h: '#191919' },
    { n: 'Text', h: '#EEEEEE' },
    { n: 'Muted', h: '#7B7B7B' },
  ];

  return (
    <div style={{ padding: 32, overflowY: 'auto', height: '100%' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em', marginBottom: 24 }}>Brand kit</h1>
        <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 }}>Colors</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {colors.map(c => (
              <div key={c.n} style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: 50, background: c.h, borderBottom: `0.5px solid ${BORDER}` }} />
                <div style={{ padding: '7px 10px' }}>
                  <div style={{ fontSize: 11, color: TEXT, fontWeight: 500 }}>{c.n}</div>
                  <div style={{ fontSize: 10, color: TEXT_DIM }}>{c.h}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 24 }}>
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 }}>
            Typography · Geist
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em' }}>Display heading</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: TEXT, letterSpacing: '-0.01em' }}>Section heading</div>
            <div style={{ fontSize: 14, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>Body copy — Geist 400</div>
            <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Caption / Label</div>
          </div>
        </div>
      </div>
    </div>
  );
}
