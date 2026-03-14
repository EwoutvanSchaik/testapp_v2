'use client';

import { useState } from 'react';

const AH_BLUE = '#007BC1';
const AH_BLUE_DARK = '#003B73';

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

function ScoreBadge({ value }: { value: number }) {
  const color =
    value <= 3 ? '#ef4444'
    : value <= 5 ? '#f97316'
    : value <= 7 ? '#eab308'
    : '#16a34a';
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
  const color =
    value <= 3 ? '#ef4444'
    : value <= 5 ? '#f97316'
    : value <= 7 ? '#eab308'
    : '#16a34a';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-44 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${(value / 10) * 100}%`, background: `linear-gradient(90deg, ${AH_BLUE}, ${color})` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 w-8 text-right">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3" style={{ background: '#E8F4FB' }}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold" style={{ color: AH_BLUE_DARK }}>{value}</p>
      <p className="text-sm text-gray-500 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#F4F7FB' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow" style={{ background: AH_BLUE_DARK }}>
              🔐
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: AH_BLUE_DARK }}>Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Voer het wachtwoord in om feedback te bekijken.</p>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-7">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              placeholder="Wachtwoord"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-blue-400 transition-all mb-3"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mb-3 font-medium">{error}</p>}
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full font-bold py-3 rounded-xl text-base text-white transition-all hover:opacity-90 disabled:opacity-50 shadow"
              style={{ background: AH_BLUE_DARK }}
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
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F7FB' }}>

      {/* Header */}
      <header style={{ background: AH_BLUE_DARK }} className="w-full shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow" style={{ background: '#FFA500', color: AH_BLUE_DARK }}>E</div>
            <span className="text-white font-bold text-lg">Feedback overzicht</span>
          </div>
          <button
            onClick={() => setSubmissions(null)}
            className="text-sm text-blue-200 hover:text-white transition-colors border border-blue-400/40 hover:border-white/60 px-4 py-2 rounded-xl"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <p className="text-sm text-gray-500 mb-6">{submissions.length} inzending{submissions.length !== 1 ? 'en' : ''} ontvangen</p>

          {submissions.length === 0 ? (
            <div className="bg-white border border-blue-100 rounded-2xl p-16 text-center text-gray-400 text-base shadow-sm">
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
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: AH_BLUE_DARK }}>Gemiddelde scores</h2>
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Samenwerking</p>
                    <div className="space-y-3">
                      {COLLAB_FIELDS.map(({ field, label }) => (
                        <ScoreBar key={field} label={label} value={avg(submissions, field)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Vaardigheden</p>
                    <div className="space-y-3">
                      {SKILLS_FIELDS.map(({ field, label }) => (
                        <ScoreBar key={field} label={label} value={avg(submissions, field)} />
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <ScoreBar label="Algehele beoordeling" value={overallAvg} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Opnieuw samenwerken */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: AH_BLUE_DARK }}>Opnieuw samenwerken?</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(
                    submissions.reduce((acc: Record<string, number>, s) => {
                      acc[s.opnieuwSamenwerken] = (acc[s.opnieuwSamenwerken] ?? 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1]).map(([opt, count]) => (
                    <span key={opt} className="px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 text-blue-700" style={{ background: '#E8F4FB' }}>
                      {opt} <span className="ml-1 font-bold" style={{ color: AH_BLUE_DARK }}>{count}×</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Individuele inzendingen */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-widest px-1" style={{ color: AH_BLUE_DARK }}>Individuele inzendingen</h2>
                {submissions.map((s, i) => {
                  const displayName = s.name?.trim() || 'Anoniem';
                  const initial = displayName.charAt(0).toUpperCase();
                  const relLabel = s.relationship === 'Anders' && s.relationshipOther ? s.relationshipOther : s.relationship;
                  return (
                    <div key={s.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm"
                            style={{ background: AH_BLUE_DARK }}>
                            {initial}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">{displayName}</span>
                            <span className="ml-2 text-sm text-gray-400">{relLabel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <ScoreBadge value={s.ratAlgemeen} />
                          <span className="text-xs text-gray-400 hidden sm:block">
                            {new Date(s.submittedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-gray-400 text-xs">{expanded === i ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {expanded === i && (
                        <div className="border-t border-blue-50 px-5 pb-6 pt-5 space-y-6">

                          {/* Scores grid */}
                          <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Samenwerking</p>
                              <div className="space-y-2">
                                {COLLAB_FIELDS.map(({ field, label }) => (
                                  <div key={field} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-500">{label}</span>
                                    <ScoreBadge value={Number(s[field])} />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Vaardigheden</p>
                              <div className="space-y-2">
                                {SKILLS_FIELDS.map(({ field, label }) => (
                                  <div key={field} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-500">{label}</span>
                                    <ScoreBadge value={Number(s[field])} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Open antwoorden */}
                          <div className="space-y-3">
                            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                              <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1.5">Bijzonder goed</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{s.openGoed}</p>
                            </div>
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1.5">Groeipunt</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{s.openGroei}</p>
                            </div>
                            {s.openSituatie && (
                              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">Situatie</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{s.openSituatie}</p>
                              </div>
                            )}
                            {s.openAdvies && (
                              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">Advies</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{s.openAdvies}</p>
                              </div>
                            )}
                            {s.ratAlgemeenOpmerking && (
                              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: AH_BLUE_DARK }}>Toelichting algehele beoordeling</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{s.ratAlgemeenOpmerking}</p>
                              </div>
                            )}
                            {s.opmerking && (
                              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">Overige opmerkingen</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{s.opmerking}</p>
                              </div>
                            )}
                            {s.remarks && Object.keys(s.remarks).length > 0 && (
                              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: AH_BLUE_DARK }}>Opmerkingen bij scores</p>
                                <div className="space-y-2">
                                  {Object.entries(s.remarks).filter(([, v]) => v).map(([k, v]) => (
                                    <div key={k}>
                                      <p className="text-xs text-gray-400 font-semibold">{k}</p>
                                      <p className="text-sm text-gray-700">{v}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-gray-400 uppercase tracking-wider">Opnieuw samenwerken?</span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: AH_BLUE_DARK }}>
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

      <footer className="py-5 text-center text-sm text-gray-400 border-t border-blue-100 bg-white">
        © {new Date().getFullYear()} · Feedback voor Ewout · Admin
      </footer>
    </div>
  );
}
