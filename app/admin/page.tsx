'use client';

import { useState } from 'react';

const RATING_LABELS: Record<number, string> = {
  1: 'Onvoldoende', 2: 'Matig', 3: 'Voldoende', 4: 'Goed', 5: 'Uitstekend',
};

type Submission = {
  id: number; submittedAt: string; name: string; email?: string; role?: string; relationship: string;
  ratCommunicatie: number; ratBetrouwbaarheid: number; ratSamenwerking: number;
  ratLuistervaardigheid: number; ratOpenheid: number; ratOndersteuning: number;
  ratKwaliteit: number; ratProactiviteit: number; ratProbleemoplossend: number; ratAanpassingsvermogen: number;
  openGoed: string; openGroei: string; openSituatie?: string; openAdvies?: string;
  ratAlgemeen: number; opnieuwSamenwerken: string; opmerking?: string;
};

const COLLAB_FIELDS: { field: keyof Submission; label: string }[] = [
  { field: 'ratCommunicatie', label: 'Communicatie' },
  { field: 'ratBetrouwbaarheid', label: 'Betrouwbaarheid' },
  { field: 'ratSamenwerking', label: 'Samenwerking' },
  { field: 'ratLuistervaardigheid', label: 'Luistervaardigheid' },
  { field: 'ratOpenheid', label: 'Openheid' },
  { field: 'ratOndersteuning', label: 'Ondersteuning' },
];

const SKILLS_FIELDS: { field: keyof Submission; label: string }[] = [
  { field: 'ratKwaliteit', label: 'Kwaliteit van werk' },
  { field: 'ratProactiviteit', label: 'Proactiviteit' },
  { field: 'ratProbleemoplossend', label: 'Probleemoplossend' },
  { field: 'ratAanpassingsvermogen', label: 'Aanpassingsvermogen' },
];

function avg(submissions: Submission[], field: keyof Submission): number {
  if (!submissions.length) return 0;
  return Math.round((submissions.reduce((a, s) => a + Number(s[field] ?? 0), 0) / submissions.length) * 10) / 10;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-amber-400">{'★'.repeat(value)}</span>
      <span className="text-white/15">{'★'.repeat(5 - value)}</span>
      <span className="ml-1 text-xs text-white/40">({value}/5)</span>
    </span>
  );
}

function GradientBar({ label, value, color = '#6366f1,#8b5cf6' }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60 w-44 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${(value / 5) * 100}%`, background: `linear-gradient(90deg, ${color})` }}
        />
      </div>
      <span className="text-sm font-semibold text-white w-10 text-right">{value}</span>
    </div>
  );
}

function StatCard({ label, value, sub, gradient }: { label: string; value: string; sub?: string; gradient: string }) {
  return (
    <div className="rounded-2xl p-5 border border-white/5 bg-white/5 backdrop-blur">
      <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center text-base" style={{ background: gradient }}>
        {label === 'Inzendingen' ? '📋' : label === 'Gemiddeld' ? '⭐' : '🤝'}
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-sm text-white/50 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/feedback?password=${encodeURIComponent(password)}`);
      if (res.status === 401) { setError('Onjuist wachtwoord.'); setLoading(false); return; }
      if (!res.ok) throw new Error();
      setSubmissions((await res.json()).reverse());
    } catch { setError('Er is iets misgegaan.'); }
    setLoading(false);
  }

  // Login screen
  if (submissions === null) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative w-full max-w-sm">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 mx-auto" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              🔐
            </div>
            <h1 className="text-xl font-extrabold text-white text-center mb-1">Admin</h1>
            <p className="text-sm text-white/40 text-center mb-7">Voer het wachtwoord in om feedback te bekijken.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              placeholder="Wachtwoord"
              className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              autoFocus
            />
            {error && <p className="text-xs text-red-400 mb-3 font-medium">{error}</p>}
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full font-bold py-3 rounded-xl text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {loading ? 'Laden…' : 'Inloggen'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allFields = [...COLLAB_FIELDS, ...SKILLS_FIELDS];
  const overallAvg = avg(submissions, 'ratAlgemeen');
  const positief = submissions.filter(s => ['Ja, zeker', 'Waarschijnlijk wel'].includes(s.opnieuwSamenwerken)).length;

  return (
    <div className="min-h-screen bg-[#080b14] text-white py-10 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-600/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Feedback overzicht</h1>
            <p className="text-sm text-white/40 mt-0.5">{submissions.length} inzending{submissions.length !== 1 ? 'en' : ''} ontvangen</p>
          </div>
          <button
            onClick={() => setSubmissions(null)}
            className="text-sm text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl"
          >
            Uitloggen
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center text-white/30 text-sm">
            Nog geen feedback ontvangen.
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="Inzendingen" value={String(submissions.length)} gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" />
              <StatCard label="Gemiddeld" value={`${overallAvg}/5`} sub={RATING_LABELS[Math.round(overallAvg)]} gradient="linear-gradient(135deg, #f59e0b, #ef4444)" />
              <StatCard label="Opnieuw samenwerken" value={`${submissions.length ? Math.round((positief / submissions.length) * 100) : 0}%`} sub={`${positief} van ${submissions.length}`} gradient="linear-gradient(135deg, #10b981, #06b6d4)" />
            </div>

            {/* Gemiddelde scores */}
            <div className="bg-white/5 backdrop-blur border border-white/8 rounded-3xl p-6 mb-5">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">Gemiddelde scores</h2>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Samenwerking</p>
                  <div className="space-y-3">
                    {COLLAB_FIELDS.map(({ field, label }) => (
                      <GradientBar key={field} label={label} value={avg(submissions, field)} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Vaardigheden</p>
                  <div className="space-y-3">
                    {SKILLS_FIELDS.map(({ field, label }) => (
                      <GradientBar key={field} label={label} value={avg(submissions, field)} color="#f59e0b,#ef4444" />
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <GradientBar label="Algehele beoordeling" value={overallAvg} color="#10b981,#06b6d4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Opnieuw samenwerken */}
            <div className="bg-white/5 border border-white/8 rounded-3xl p-6 mb-5">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Opnieuw samenwerken?</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  submissions.reduce((acc: Record<string, number>, s) => { acc[s.opnieuwSamenwerken] = (acc[s.opnieuwSamenwerken] ?? 0) + 1; return acc; }, {})
                ).sort((a, b) => b[1] - a[1]).map(([opt, count]) => (
                  <span key={opt} className="px-4 py-2 rounded-full text-sm font-semibold border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                    {opt} <span className="ml-1 text-indigo-400 font-bold">{count}×</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Inzendingen */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest px-1">Individuele inzendingen</h2>
              {submissions.map((s, i) => (
                <div key={s.id} className="bg-white/5 border border-white/8 rounded-3xl overflow-hidden hover:border-white/12 transition-colors">
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-white">{s.name}</span>
                        <span className="ml-2 text-sm text-white/40">{s.relationship}</span>
                        {s.role && <span className="ml-2 text-xs text-white/25">({s.role})</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-amber-400">{'★'.repeat(s.ratAlgemeen)}<span className="text-white/10">{'★'.repeat(5 - s.ratAlgemeen)}</span></span>
                      <span className="text-xs text-white/30 hidden sm:block">
                        {new Date(s.submittedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-white/30 text-xs">{expanded === i ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {expanded === i && (
                    <div className="border-t border-white/5 px-5 pb-6 pt-5 space-y-6">
                      {s.email && (
                        <p className="text-sm text-white/40">E-mail: <a href={`mailto:${s.email}`} className="text-indigo-400 hover:underline">{s.email}</a></p>
                      )}

                      {/* Ratings grid */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Samenwerking</p>
                          <div className="space-y-1.5">
                            {COLLAB_FIELDS.map(({ field, label }) => (
                              <div key={field} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
                                <span className="text-white/50">{label}</span>
                                <Stars value={Number(s[field])} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Vaardigheden</p>
                          <div className="space-y-1.5">
                            {SKILLS_FIELDS.map(({ field, label }) => (
                              <div key={field} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
                                <span className="text-white/50">{label}</span>
                                <Stars value={Number(s[field])} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Open antwoorden */}
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-emerald-500/8 border border-emerald-400/15 p-4">
                          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1.5">Bijzonder goed</p>
                          <p className="text-sm text-white/80 leading-relaxed">{s.openGoed}</p>
                        </div>
                        <div className="rounded-2xl bg-amber-500/8 border border-amber-400/15 p-4">
                          <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1.5">Groeipunt</p>
                          <p className="text-sm text-white/80 leading-relaxed">{s.openGroei}</p>
                        </div>
                        {s.openSituatie && (
                          <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
                            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1.5">Situatie</p>
                            <p className="text-sm text-white/70 leading-relaxed">{s.openSituatie}</p>
                          </div>
                        )}
                        {s.openAdvies && (
                          <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
                            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1.5">Advies</p>
                            <p className="text-sm text-white/70 leading-relaxed">{s.openAdvies}</p>
                          </div>
                        )}
                        {s.opmerking && (
                          <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
                            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1.5">Overige opmerkingen</p>
                            <p className="text-sm text-white/70 leading-relaxed">{s.opmerking}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-white/30 uppercase tracking-wider">Opnieuw samenwerken?</span>
                          <span className="px-3 py-1 bg-indigo-500/15 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-400/20">{s.opnieuwSamenwerken}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
