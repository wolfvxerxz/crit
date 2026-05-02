'use client';

import { ORANGE, TEXT_MUTED } from '@/lib/colors';

interface LoadingBarsProps {
  progress?: number;
  label?: string;
}

export default function LoadingBars({ progress = 0, label = 'Analysing design...' }: LoadingBarsProps) {
  const totalBars = 40;
  const filledBars = Math.floor((progress / 100) * totalBars);

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ fontSize: 12, color: ORANGE, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {Math.floor(progress)}%
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: totalBars }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 24,
              background: i < filledBars ? ORANGE : '#222',
              borderRadius: 1,
              transition: 'background 0.15s ease',
              opacity: i < filledBars ? 1 : 0.5,
              boxShadow: i < filledBars ? '0 0 8px rgba(255,85,18,0.4)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
