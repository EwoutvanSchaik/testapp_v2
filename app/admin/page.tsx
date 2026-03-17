'use client';

import { useState } from 'react';

const AH_BLUE = '#00ade6';

const SCORE_LABEL = (v: number) => {
  if (v <= 3) return 'Onvoldoende';
  if (v <= 5) return 'Matig';
  if (v <= 7) return 'Voldoende';
  if (v <= 9) return 'Goed';
  return 'Uitstekend';
};

type Submission = {
  id: number; submittedAt: string; name: string; relationship: string; relationshipOther?: string;
  ratCommunicatie: number; ratBetrouwbaarheid: number; ratSamenwerking: number;
  ratLuistervaardigheid: number; ratOpenheid: number; ratOndersteuning: number;
  ratKwaliteit: number; ratProactiviteit: number; ratProbleemoplossend: number; ratAanpassingsvermogen: number;
  openGoed: string; openGroei: string; openSituatie?: string; openAdvies?: string;
  ratAlgemeen: number; ratAlgemeenOpmerking?: string; opnieuwSamenwerken: string; opmerking?: string;
  remarks?: Record<string, string>;
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

function scoreColor(v: number) {
  if (v <= 3) return '#ef4444';
  if (v <= 5) return '#f97316';
  if (v <= 7) return '#eab308';
  return '#16a34a';
}

function ScoreBadge({ value }: { value: number }) {
  const color = scoreColor(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-base font-extrabold tabular-nums" style={{ color }}>{value}</span>
      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color, background: `${color}15` }}>
        {SCORE_LABEL(value)}
      </span>
    </span>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500 w-44 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-sky-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${(value / 10) * 100}%`, background: `linear-gradient(90deg, ${AH_BLUE}, ${color})` }} />
      </div>
      <span className="text-sm font-bold text-slate-700 w-8 text-right">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3" style={{ background: '#e0f4fb' }}>
        {icon}
      </div>
      <p className="text-xl font-extrabold tracking-tight" style={{ color: AH_BLUE }}>{value}</p>
      <p className="text-sm text-slate-500 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
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

  /* ── Login screen ── */
  if (submissions === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f7fb]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow text-white" style={{ background: AH_BLUE }}>
              🔐
            </div>
            <h1 className="text-xl font-extrabold tracking-tight" style={{ color: AH_BLUE }}>Admin</h1>
            <p className="text-sm text-slate-500 mt-1">Voer het wachtwoord in om feedback te bekijken.</p>
          </div>
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-7">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              placeholder="Wachtwoord"
              className="w-full rounded-xl border border-sky-200 bg-sky-50 text-slate-800 placeholder-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-sky-400 transition-all mb-3"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mb-3 font-medium">{error}</p>}
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full font-bold py-3 rounded-xl text-base text-white transition-all hover:scale-[1.02] disabled:opacity-50 shadow-md"
              style={{ background: 'linear-gradient(135deg, #00ade6, #0095c8)', boxShadow: '0 4px 20px rgba(0,173,230,0.35)' }}
            >
              {loading ? 'Laden…' : 'Inloggen'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overallAvg = avg(submissions, 'ratAlgemeen');
  const positief = submissions.filter(s => ['Ja, zeker', 'Waarschijnlijk wel'].includes(s.opnieuwSamenwerken)).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7fb]">

      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow object-cover" />
            <span className="font-extrabold text-base tracking-tight text-slate-800">Feedback overzicht</span>
          </div>
          <button onClick={() => setSubmissions(null)}
            className="text-sm text-slate-400 hover:text-slate-700 transition-colors border border-sky-200 hover:border-sky-400 px-4 py-2 rounded-xl">
            Uitloggen
          </button>
        </div>
      </header>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <p className="text-sm text-slate-500 mb-6">{submissions.length} inzending{submissions.length !== 1 ? 'en' : ''} ontvangen</p>

          {submissions.length === 0 ? (
            <div className="bg-white border border-sky-100 rounded-2xl p-16 text-center text-slate-400 text-base shadow-sm">
              Nog geen feedback ontvangen.
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard icon="📋" label="Inzendingen" value={String(submissions.length)} />
                <StatCard icon="⭐" label="Gemiddelde score" value={`${overallAvg}/10`} sub={SCORE_LABEL(Math.round(overallAvg))} />
                <StatCard icon="🤝" label="Opnieuw samenwerken" value={`${submissions.length ? Math.round((positief / submissions.length) * 100) : 0}%`} sub={`${positief} van ${submissions.length}`} />
              </div>

              {/* Gemiddelde scores */}
              <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: AH_BLUE }}>Gemiddelde scores</h2>
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Samenwerking</p>
                    <div className="space-y-3">
                      {COLLAB_FIELDS.map(({ field, label }) => (
                        <ScoreBar key={field} label={label} value={avg(submissions, field)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Vaardigheden</p>
                    <div className="space-y-3">
                      {SKILLS_FIELDS.map(({ field, label }) => (
                        <ScoreBar key={field} label={label} value={avg(submissions, field)} />
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-sky-100">
                      <ScoreBar label="Algehele beoordeling" value={overallAvg} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Opnieuw samenwerken */}
              <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: AH_BLUE }}>Opnieuw samenwerken?</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(
                    submissions.reduce((acc: Record<string, number>, s) => {
                      acc[s.opnieuwSamenwerken] = (acc[s.opnieuwSamenwerken] ?? 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1]).map(([opt, count]) => (
                    <span key={opt} className="px-4 py-2 rounded-full text-sm font-semibold border border-sky-200 text-sky-700" style={{ background: '#e0f4fb' }}>
                      {opt} <span className="ml-1 font-bold" style={{ color: AH_BLUE }}>{count}×</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Individuele inzendingen */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: AH_BLUE }}>Individuele inzendingen</h2>
                {submissions.map((s, i) => {
                  const displayName = s.name?.trim() || 'Anoniem';
                  const initial = displayName.charAt(0).toUpperCase();
                  const relLabel = s.relationship === 'Anders' && s.relationshipOther ? s.relationshipOther : s.relationship;
                  return (
                    <div key={s.id} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-sky-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm"
                            style={{ background: AH_BLUE }}>
                            {initial}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800">{displayName}</span>
                            <span className="ml-2 text-sm text-slate-400">{relLabel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <ScoreBadge value={s.ratAlgemeen} />
                          <span className="text-xs text-slate-400 hidden sm:block">
                            {new Date(s.submittedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-slate-400 text-xs">{expanded === i ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {expanded === i && (
                        <div className="border-t border-sky-50 px-5 pb-6 pt-5 space-y-6">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Samenwerking</p>
                              <div className="space-y-2">
                                {COLLAB_FIELDS.map(({ field, label }) => (
                                  <div key={field} className="flex justify-between items-center py-1.5 border-b border-sky-50 last:border-0">
                                    <span className="text-sm text-slate-500">{label}</span>
                                    <ScoreBadge value={Number(s[field])} />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Vaardigheden</p>
                              <div className="space-y-2">
                                {SKILLS_FIELDS.map(({ field, label }) => (
                                  <div key={field} className="flex justify-between items-center py-1.5 border-b border-sky-50 last:border-0">
                                    <span className="text-sm text-slate-500">{label}</span>
                                    <ScoreBadge value={Number(s[field])} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                              <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1.5">Bijzonder goed</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{s.openGoed}</p>
                            </div>
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1.5">Groeipunt</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{s.openGroei}</p>
                            </div>
                            {s.openSituatie && (
                              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Situatie</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{s.openSituatie}</p>
                              </div>
                            )}
                            {s.openAdvies && (
                              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Advies</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{s.openAdvies}</p>
                              </div>
                            )}
                            {s.ratAlgemeenOpmerking && (
                              <div className="rounded-xl border p-4" style={{ background: '#e0f4fb', borderColor: '#b3e3f5' }}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: AH_BLUE }}>Toelichting algehele beoordeling</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{s.ratAlgemeenOpmerking}</p>
                              </div>
                            )}
                            {s.opmerking && (
                              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Overige opmerkingen</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{s.opmerking}</p>
                              </div>
                            )}
                            {s.remarks && Object.keys(s.remarks).length > 0 && (
                              <div className="rounded-xl border p-4" style={{ background: '#e0f4fb', borderColor: '#b3e3f5' }}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: AH_BLUE }}>Opmerkingen bij scores</p>
                                <div className="space-y-2">
                                  {Object.entries(s.remarks).filter(([, v]) => v).map(([k, v]) => (
                                    <div key={k}>
                                      <p className="text-xs text-slate-400 font-semibold">{k}</p>
                                      <p className="text-sm text-slate-700">{v}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-slate-400 uppercase tracking-wider">Opnieuw samenwerken?</span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: AH_BLUE }}>
                                {s.opnieuwSamenwerken}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="py-5 text-center text-sm text-slate-400 border-t border-sky-100 bg-white">
        © {new Date().getFullYear()} · Feedback voor Ewout · Admin
      </footer>
    </div>
  );
}
