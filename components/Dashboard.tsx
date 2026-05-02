'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ORANGE, BG, BORDER, TEXT, TEXT_MUTED, TEXT_DIM, SURFACE } from '@/lib/colors';
import { getSession, clearSession, getHistory, type User, type Critique } from '@/lib/storage';
import CritiqueFlow from './CritiqueFlow';
import CritiqueResult from './CritiqueResult';
import { CritiquesView, ProjectsView, HistoryView, BrandKitView } from './views';

type View = 'critiques' | 'projects' | 'history' | 'brand' | 'run';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('critiques');
  const [history, setHistory] = useState<Critique[]>([]);
  const [selected, setSelected] = useState<Critique | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session);
    setHistory(getHistory());
    setMounted(true);
  }, [router]);

  useEffect(() => {
    if (mounted) setHistory(getHistory());
  }, [view, mounted]);

  if (!mounted || !user) {
    return (
      <div style={{ height: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_MUTED, fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  const logout = () => {
    clearSession();
    router.push('/');
  };

  const renderMain = () => {
    if (view === 'run') {
      return (
        <CritiqueFlow
          onComplete={c => {
            setSelected(c);
            setView('critiques');
            setHistory(getHistory());
          }}
          onCancel={() => setView('critiques')}
        />
      );
    }
    if (selected) return <CritiqueResult critique={selected} onClose={() => setSelected(null)} />;
    if (view === 'critiques') return <CritiquesView history={history} onOpen={setSelected} onNew={() => setView('run')} />;
    if (view === 'projects') return <ProjectsView history={history} />;
    if (view === 'history') return <HistoryView history={history} onOpen={setSelected} />;
    if (view === 'brand') return <BrandKitView />;
    return null;
  };

  const navItems = [
    {
      k: 'critiques' as View,
      label: 'Critiques',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      k: 'projects' as View,
      label: 'Projects',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M2 7h7M2 10h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>,
    },
    {
      k: 'history' as View,
      label: 'History',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1" /><path d="M7 4.5v2.5l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>,
    },
    {
      k: 'brand' as View,
      label: 'Brand kit',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1" /><path d="M5 5h4M5 7h4M5 9h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>,
    },
  ];

  const initial = (user.name || user.email)[0].toUpperCase();

  return (
    <div style={{ height: '100vh', background: BG, display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden' }}>
      <div style={{ borderRight: `0.5px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 12px 10px' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, letterSpacing: '-0.01em', padding: '2px 6px', marginBottom: 12 }}>
            crit<span style={{ color: ORANGE }}>.</span>
          </div>
          <button
            onClick={() => setView('run')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '8px 12px',
              background: ORANGE,
              border: 'none',
              borderRadius: 1000,
              fontSize: 13,
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            New critique
          </button>
        </div>

        <div style={{ fontSize: 10, fontWeight: 500, color: TEXT_DIM, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '14px 16px 6px' }}>
          Navigation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
          {navItems.map(n => (
            <div
              key={n.k}
              onClick={() => {
                setView(n.k);
                setSelected(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 10px',
                borderRadius: 4,
                fontSize: 13,
                color: view === n.k ? TEXT : TEXT_DIM,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                background: view === n.k ? SURFACE : 'transparent',
              }}
            >
              {n.icon} {n.label}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '12px 10px', borderTop: `0.5px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 4 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: ORANGE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: TEXT, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name || user.email}
              </div>
              <div onClick={logout} style={{ fontSize: 10, color: TEXT_DIM, cursor: 'pointer' }}>
                Log out
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{renderMain()}</div>
    </div>
  );
}
