'use client';

import { useState, useRef } from 'react';
import { ORANGE, ORANGE_DARK, BG, SURFACE, BORDER, TEXT, TEXT_MUTED, TEXT_DIM } from '@/lib/colors';
import { addToHistory, type Critique } from '@/lib/storage';
import LoadingBars from './LoadingBars';
import CritiqueResult from './CritiqueResult';

interface CritiqueFlowProps {
  onComplete: (critique: Critique) => void;
  onCancel: () => void;
}

type Step = 'upload' | 'analyzing' | 'complete';

export default function CritiqueFlow({ onComplete, onCancel }: CritiqueFlowProps) {
  const [step, setStep] = useState<Step>('upload');
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Reading your design...');
  const [critique, setCritique] = useState<Critique | null>(null);
  const [error, setError] = useState('');
  const [designContext, setDesignContext] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image (PNG, JPG, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setImageData(dataUrl.split(',')[1]);
      setImageMime(file.type);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const runCritique = async () => {
    if (!imageData || !imageMime) return;
    setStep('analyzing');
    setProgress(0);
    setError('');

    const stages = [
      { p: 12, label: 'Reading your design...' },
      { p: 28, label: 'Analysing visual hierarchy...' },
      { p: 45, label: 'Evaluating clarity and readability...' },
      { p: 62, label: 'Checking trust signals...' },
      { p: 78, label: 'Scoring conversion potential...' },
      { p: 92, label: 'Writing your critique...' },
    ];

    let stageIdx = 0;
    const stageTimer = setInterval(() => {
      if (stageIdx < stages.length) {
        const target = stages[stageIdx].p;
        setProgressLabel(stages[stageIdx].label);
        const start = stageIdx === 0 ? 0 : stages[stageIdx - 1].p;
        const duration = 800;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setProgress(start + (target - start) * eased);
          if (t < 1) requestAnimationFrame(animate);
        };
        animate();
        stageIdx++;
      } else {
        clearInterval(stageTimer);
      }
    }, 900);

    try {
      const response = await fetch('/api/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData, imageMime, designContext }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || 'Failed to generate critique');
      }

      const parsed = await response.json();

      clearInterval(stageTimer);
      setProgress(100);
      setProgressLabel('Done.');

      const critiqueData: Critique = {
        ...parsed,
        imagePreview: imagePreview || '',
        timestamp: Date.now(),
        id: 'crit_' + Date.now(),
      };

      addToHistory(critiqueData);

      setTimeout(() => {
        setCritique(critiqueData);
        setStep('complete');
      }, 600);
    } catch (e: any) {
      clearInterval(stageTimer);
      setError(e.message || 'Failed to analyse. Try again.');
      setStep('upload');
    }
  };

  if (step === 'analyzing') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 32 }}>
        {imagePreview && (
          <div style={{ maxWidth: 400, maxHeight: 240, overflow: 'hidden', borderRadius: 6, border: `0.5px solid ${BORDER}`, opacity: 0.4 }}>
            <img src={imagePreview} alt="" style={{ width: '100%', display: 'block' }} />
          </div>
        )}
        <LoadingBars progress={progress} label={progressLabel} />
        <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '-0.01em', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
          Crit is reading your design pixel by pixel and scoring it against the framework.
        </div>
      </div>
    );
  }

  if (step === 'complete' && critique) {
    return <CritiqueResult critique={critique} onClose={() => onComplete(critique)} />;
  }

  return (
    <div style={{ padding: 40, height: '100%', overflowY: 'auto' }}>
      <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: ORANGE, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>
            New critique
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Drop your design.
          </h1>
          <p style={{ fontSize: 14, color: TEXT_MUTED, letterSpacing: '-0.01em', lineHeight: 1.6 }}>
            Upload a screenshot or PNG of your design. Crit will score it across clarity, hierarchy, trust, and conversion — and tell you exactly what to fix.
          </p>
        </div>

        {!imagePreview ? (
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            style={{ background: SURFACE, border: `1.5px dashed ${BORDER}`, borderRadius: 8, padding: 60, textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = ORANGE)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
          >
            <div style={{ width: 48, height: 48, borderRadius: 8, background: ORANGE_DARK, border: `0.5px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: ORANGE }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 19h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ fontSize: 15, color: TEXT, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 6 }}>Drop your design here</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>or click to browse · PNG, JPG, max 10MB</div>
          </div>
        ) : (
          <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: 12, borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>Preview · ready to analyse</div>
              <button
                onClick={() => {
                  setImagePreview(null);
                  setImageData(null);
                }}
                style={{ background: 'transparent', border: 'none', color: TEXT_DIM, fontSize: 11, cursor: 'pointer' }}
              >
                Change image
              </button>
            </div>
            <div style={{ padding: 20, background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 360, overflow: 'hidden' }}>
              <img src={imagePreview} alt="" style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 4, border: `0.5px solid ${BORDER}` }} />
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />

        {imagePreview && (
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Context (optional)
            </label>
            <textarea
              value={designContext}
              onChange={e => setDesignContext(e.target.value)}
              placeholder="What is this? Who's it for? What are you trying to achieve?"
              rows={3}
              style={{ width: '100%', background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: '10px 12px', color: TEXT, fontSize: 13, outline: 'none', letterSpacing: '-0.01em', resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = ORANGE)}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
          </div>
        )}

        {error && (
          <div style={{ fontSize: 12, color: ORANGE, marginTop: 14, padding: '8px 12px', background: ORANGE_DARK, borderRadius: 4, letterSpacing: '-0.01em' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button onClick={onCancel} style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 1000, padding: '11px 20px', color: TEXT_MUTED, fontSize: 13, cursor: 'pointer', letterSpacing: '-0.01em' }}>
            Cancel
          </button>
          <button
            onClick={runCritique}
            disabled={!imageData}
            style={{
              background: imageData ? ORANGE : SURFACE,
              border: `0.5px solid ${imageData ? ORANGE : BORDER}`,
              borderRadius: 1000,
              padding: '11px 24px',
              color: imageData ? '#fff' : TEXT_DIM,
              fontSize: 13,
              fontWeight: 500,
              cursor: imageData ? 'pointer' : 'not-allowed',
              letterSpacing: '-0.01em',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            Run critique
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
