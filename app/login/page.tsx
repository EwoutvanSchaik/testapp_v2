'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Onjuist wachtwoord. Probeer het opnieuw.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full shadow-lg object-cover ring-2 ring-white/10" />
          <h1 className="text-white font-extrabold text-2xl tracking-tight">Feedback voor Ewout</h1>
        </div>

        {/* Card */}
        <div
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          style={{ boxShadow: '0 0 40px rgba(0,173,230,0.1), 0 0 80px rgba(99,102,241,0.07)' }}
        >
          <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
            Beveiligde toegang — Alleen voor collega's
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wachtwoord"
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all"
            />

            {error && (
              <p className="text-red-400 text-sm font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full font-bold py-3 rounded-xl text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #00ade6, #6366f1)',
                boxShadow: '0 4px 20px rgba(0,173,230,0.35)',
              }}
            >
              {loading ? 'Bezig…' : 'Inloggen →'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Vertrouwelijk · Persoonlijk ingezien door Ewout
        </p>
      </div>
    </div>
  );
}
