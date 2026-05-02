'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ORANGE, ORANGE_DARK, BG, SURFACE, BORDER, TEXT, TEXT_MUTED, TEXT_DIM } from '@/lib/colors';
import { getUsers, setUsers, setSession } from '@/lib/storage';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Name required');
      return;
    }
    setLoading(true);

    // Tiny artificial delay so the loading state actually shows
    await new Promise(resolve => setTimeout(resolve, 200));

    const users = getUsers();

    if (mode === 'signup') {
      if (users[email]) {
        setError('Account already exists');
        setLoading(false);
        return;
      }
      users[email] = { password, name, createdAt: Date.now() };
      setUsers(users);
      setSession({ email, name });
      router.push('/dashboard');
    } else {
      if (!users[email] || users[email].password !== password) {
        setError('Wrong email or password');
        setLoading(false);
        return;
      }
      setSession({ email, name: users[email].name });
      router.push('/dashboard');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: BG,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 4,
    padding: '10px 12px',
    color: TEXT,
    fontSize: 14,
    outline: 'none',
    letterSpacing: '-0.01em',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: TEXT_DIM,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 30, fontWeight: 500, color: TEXT, letterSpacing: '-0.02em', marginBottom: 8 }}>
            crit<span style={{ color: ORANGE }}>.</span>
          </div>
          <div style={{ fontSize: 14, color: TEXT_MUTED, letterSpacing: '-0.01em' }}>
            {mode === 'login' ? 'Welcome back.' : 'Get design feedback in 30 seconds.'}
          </div>
        </div>

        <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 24 }}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = ORANGE)}
                onBlur={e => (e.target.style.borderColor = BORDER)}
              />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@studio.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = ORANGE)}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = ORANGE)}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: ORANGE, marginBottom: 14, padding: '8px 12px', background: ORANGE_DARK, borderRadius: 4, letterSpacing: '-0.01em' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              background: ORANGE,
              border: 'none',
              borderRadius: 4,
              padding: '11px 16px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? 'wait' : 'pointer',
              letterSpacing: '-0.01em',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Just a moment...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: TEXT_DIM, letterSpacing: '-0.01em' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <span
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              style={{ color: ORANGE, cursor: 'pointer' }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: TEXT_DIM, letterSpacing: '-0.01em' }}>
          Real design feedback in 30 seconds.
        </div>
      </div>
    </div>
  );
}
