'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const PacmanGame = dynamic(() => import('@/components/PacmanGame'), { ssr: false });

const RECIPIENT_NAME = 'Ewout';

const SCORE_LABEL = (v: number) => {
  if (v <= 3) return 'Onvoldoende';
  if (v <= 5) return 'Matig';
  if (v <= 7) return 'Voldoende';
  if (v <= 9) return 'Goed';
  return 'Uitstekend';
};

const GIFS = [
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3amx5NG5ucGN5YXUzYW90cDNyZDlkMGpwbTV6eHY0OXEwbHhqcTJraiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/O9PkMbHYHtJUjBitkW/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW5ubWtkZ2VqYjNqNjJmYzh4MmNydjEzZnczNDZ5bTE2dWx1NHZpdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aR7hLb38Yt58iSEqv3/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW5ubWtkZ2VqYjNqNjJmYzh4MmNydjEzZnczNDZ5bTE2dWx1NHZpdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/svaHgjmx9NB3QEhMqK/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d2ZjeHM0MTV5MDk5MmFjNW14bHIzN3NnaXN0cDh6dDY3NWN3eGYwbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/82OKMffrUk33sChTIJ/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d2ZjeHM0MTV5MDk5MmFjNW14bHIzN3NnaXN0cDh6dDY3NWN3eGYwbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7tyvl8AyrrokzZaZKw/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW10ODF5b3JzdTB2bjA4emxnbmd1dmtoemJrbDNuaWZzYmg2N2dwbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IcGkqdUmYLFGE/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW10ODF5b3JzdTB2bjA4emxnbmd1dmtoemJrbDNuaWZzYmg2N2dwbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cS7AhVMWcA8PHBs9Vx/giphy.gif',
];

const AH_BLUE = '#00ade6';

/* ── Score Slider (1–10) ── */
function ScoreSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const pct = value > 0 ? ((value - 1) / 9) * 100 : 0;
  const color =
    value === 0 ? '#94a3b8'
    : value <= 3 ? '#ef4444'
    : value <= 5 ? '#f97316'
    : value <= 7 ? '#eab308'
    : '#16a34a';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-base text-slate-400">1</span>
        {value > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</span>
            <span className="text-base font-semibold px-2.5 py-1 rounded-full border"
              style={{ color, borderColor: `${color}50`, background: `${color}15` }}>
              {SCORE_LABEL(value)}
            </span>
          </div>
        ) : (
          <span className="text-base text-slate-400 italic">Nog niet beoordeeld</span>
        )}
        <span className="text-base text-slate-400">10</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-2 rounded-full bg-sky-100" />
        {value > 0 && (
          <div className="absolute h-2 rounded-full transition-all duration-150"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${AH_BLUE}, ${color})` }} />
        )}
        <input
          type="range" min={1} max={10} step={1}
          value={value > 0 ? value : 1}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => { if (value === 0) onChange(5); }}
          onTouchStart={() => { if (value === 0) onChange(5); }}
          className="relative w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-300 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-sky-300"
        />
      </div>
      <div className="flex justify-between px-0.5">
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <span key={n} className="text-sm tabular-nums transition-colors duration-100"
            style={{ color: value === n ? color : '#cbd5e1' }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
        style={{ background: AH_BLUE }}>
        {number}
      </div>
      <div className="pt-0.5">
        <h2 className="text-xl font-extrabold tracking-tight" style={{ color: AH_BLUE }}>{title}</h2>
        {subtitle && <p className="text-base text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ── Rating row ── */
function RatingRow({ label, description, field, ratings, setRatings, remarks, setRemarks, error }: {
  label: string; description: string; field: string;
  ratings: Record<string, number>; setRatings: (r: Record<string, number>) => void;
  remarks: Record<string, string>; setRemarks: (r: Record<string, string>) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`py-4 border-b border-sky-50 last:border-0 ${error ? 'rounded-xl bg-red-50 border border-red-200 px-4 -mx-4' : ''}`}>
      <div className="mb-3">
        <p className="text-lg font-semibold text-slate-800">{label}</p>
        <p className="text-base text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <ScoreSlider value={ratings[field] ?? 0} onChange={(v) => setRatings({ ...ratings, [field]: v })} />
      {error && <p className="text-base text-red-500 mt-1.5 font-medium">Selecteer een beoordeling</p>}
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="mt-3 flex items-center gap-1.5 text-base font-medium transition-colors"
        style={{ color: open ? AH_BLUE : '#64748b' }}>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {remarks[field] ? 'Opmerking bewerken' : 'Opmerking toevoegen'} <span className="text-slate-300 font-normal">(optioneel)</span>
      </button>
      {open && (
        <textarea value={remarks[field] ?? ''} onChange={(e) => setRemarks({ ...remarks, [field]: e.target.value })}
          rows={2} placeholder="Toelichting…"
          className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 text-slate-800 placeholder-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-sky-400 transition-all resize-y" />
      )}
    </div>
  );
}

/* ── Label ── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-lg font-semibold text-slate-700 mb-1.5">{children}</label>;
}

/* ── Input classes ── */
const inputCls = (err?: boolean) =>
  `w-full rounded-xl border bg-white text-slate-800 placeholder-slate-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:border-sky-400 transition-all ${
    err ? 'border-red-300 bg-red-50' : 'border-sky-200 hover:border-sky-300'
  }`;

/* ── Questions ── */
const COLLAB_QUESTIONS = [
  { field: 'ratCommunicatie', label: 'Communicatie', description: `Hoe duidelijk en effectief communiceert ${RECIPIENT_NAME}?` },
  { field: 'ratBetrouwbaarheid', label: 'Betrouwbaarheid & nakomen van afspraken', description: `In hoeverre komt ${RECIPIENT_NAME} deadlines en toezeggingen na?` },
  { field: 'ratSamenwerking', label: 'Samenwerkingsstijl', description: `Hoe prettig en constructief is het samenwerken met ${RECIPIENT_NAME}?` },
  { field: 'ratLuistervaardigheid', label: 'Luistervaardigheid', description: `Hoe goed luistert ${RECIPIENT_NAME} naar jouw ideeën en zorgen?` },
  { field: 'ratOpenheid', label: 'Openheid voor feedback', description: `In hoeverre staat ${RECIPIENT_NAME} open voor kritische feedback?` },
  { field: 'ratOndersteuning', label: "Ondersteuning van collega's", description: `In hoeverre helpt ${RECIPIENT_NAME} collega's proactief?` },
];

const SKILLS_QUESTIONS = [
  { field: 'ratKwaliteit', label: 'Kwaliteit van werk', description: `Hoe beoordeel je de kwaliteit en grondigheid van het werk van ${RECIPIENT_NAME}?` },
  { field: 'ratProactiviteit', label: 'Proactiviteit & initiatief', description: `In hoeverre neemt ${RECIPIENT_NAME} initiatief en anticipeert op problemen?` },
  { field: 'ratProbleemoplossend', label: 'Probleemoplossend vermogen', description: `Hoe effectief lost ${RECIPIENT_NAME} complexe uitdagingen op?` },
  { field: 'ratAanpassingsvermogen', label: 'Aanpassingsvermogen', description: `Hoe goed gaat ${RECIPIENT_NAME} om met veranderingen en onzekerheid?` },
];

const SECTIONS = ['Gegevens', 'Samenwerking', 'Vaardigheden', 'Open vragen', 'Indruk'];

type FormData = {
  name: string; relationship: string; relationshipOther: string;
  openGoed: string; openGroei: string; openSituatie: string; openAdvies: string;
  ratAlgemeen: number; ratAlgemeenOpmerking: string; opnieuwSamenwerken: string; opmerking: string;
};

/* ── Success + Easter Egg screen ── */
function SuccessScreen({ gif }: { gif: string }) {
  const [showGame, setShowGame] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7fb]">
      <header className="w-full bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow object-cover" />
          <span className="font-extrabold text-lg tracking-tight text-slate-800">Feedback voor Ewout</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-sky-100 shadow-lg overflow-hidden text-center">
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${AH_BLUE}, #6366f1)` }} />
          <div className="p-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow text-white" style={{ background: AH_BLUE }}>
              🎉
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-slate-900">Bedankt voor je feedback!</h1>
            <p className="text-slate-500 mb-7 leading-relaxed text-base">
              Je inzending is ontvangen. {RECIPIENT_NAME} zal de feedback persoonlijk inzien.
            </p>
            <img src={gif} alt="Bedankt!" width={300} className="mx-auto rounded-xl shadow-md border border-sky-100" />
          </div>
        </div>

        {!showGame && (
          <button
            onClick={() => setShowGame(true)}
            className="flex items-center gap-3 px-12 py-6 rounded-2xl font-bold text-white transition-all duration-200 hover:scale-105 active:scale-[0.98] shadow-md text-xl"
            style={{ background: 'linear-gradient(135deg, #00ade6, #6366f1)', boxShadow: '0 4px 20px rgba(0,173,230,0.3)' }}
          >
            🕹️ Ontspan even: Speel Pac-Man
          </button>
        )}

        {showGame && (
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-sky-100 shadow-lg overflow-hidden">
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #facc15, #f97316)' }} />
              <div className="p-5 flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-extrabold tracking-tight text-lg text-slate-800">👾 Pac-Man</h2>
                  <button onClick={() => setResetKey(k => k + 1)}
                    className="text-xs text-slate-400 hover:text-slate-700 transition-colors px-2 py-1 rounded-lg border border-sky-200 hover:border-sky-400">
                    ↺ Opnieuw
                  </button>
                </div>
                <PacmanGame resetKey={resetKey} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedbackForm() {
  const [form, setForm] = useState<FormData>({
    name: '', relationship: '', relationshipOther: '',
    openGoed: '', openGroei: '', openSituatie: '', openAdvies: '',
    ratAlgemeen: 0, ratAlgemeenOpmerking: '', opnieuwSamenwerken: '', opmerking: '',
  });
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [algemeenOpen, setAlgemeenOpen] = useState(false);

  const allRatingFields = [...COLLAB_QUESTIONS, ...SKILLS_QUESTIONS].map((q) => q.field);

  function validate() {
    const e: Record<string, boolean> = {};
    if (!form.relationship) e.relationship = true;
    if (form.relationship === 'Anders' && !form.relationshipOther.trim()) e.relationshipOther = true;
    allRatingFields.forEach((f) => { if (!ratings[f]) e[f] = true; });
    if (!form.openGoed.trim()) e.openGoed = true;
    if (!form.openGroei.trim()) e.openGroei = true;
    if (!form.ratAlgemeen) e.ratAlgemeen = true;
    if (!form.opnieuwSamenwerken) e.opnieuwSamenwerken = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...ratings, remarks }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch { setStatus('error'); }
  }

  if (status === 'success') {
    const gif = GIFS[Math.floor(Math.random() * GIFS.length)];
    return <SuccessScreen gif={gif} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7fb]">

      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow object-cover" />
            <span className="font-extrabold text-lg tracking-tight text-slate-800">Feedback voor Ewout</span>
          </div>
          <span className="text-slate-400 text-sm hidden sm:block">Vertrouwelijk · persoonlijk ingezien</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          {SECTIONS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ background: AH_BLUE }}>
                {i + 1}
              </div>
              <span className="text-base font-medium text-slate-500 hidden sm:block">{s}</span>
              {i < SECTIONS.length - 1 && <div className="w-5 h-px bg-sky-200 ml-1 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Feedbackformulier
            </h1>
            <p className="mt-3 text-slate-500 text-lg max-w-xs mx-auto leading-relaxed">
              Jouw antwoorden worden vertrouwelijk en persoonlijk ingezien door {RECIPIENT_NAME}.
            </p>
            <p className="mt-1.5 text-base text-slate-400">Velden met * zijn verplicht</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Section 1 */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: AH_BLUE }} />
              <div className="p-7">
                <SectionHeader number={1} title="Jouw gegevens" subtitle="Wie geeft deze feedback?" />
                <div className="space-y-4">
                  <div>
                    <Label>Naam <span className="text-slate-400 font-normal text-base">(optioneel)</span></Label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Voor- en achternaam" className={inputCls()} />
                  </div>
                  <div data-error={errors.relationship ? '' : undefined}>
                    <Label>Mijn relatie tot {RECIPIENT_NAME} <span className="text-red-500">*</span></Label>
                    <select value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                      className={inputCls(errors.relationship)}>
                      <option value="">Selecteer een optie</option>
                      {['Directe collega (zelfde team)', 'Collega (andere afdeling)', 'Leidinggevende', 'Stakeholder / opdrachtgever intern', 'Projectpartner', 'Anders'].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    {errors.relationship && <p className="text-base text-red-500 mt-1.5 font-medium">Selecteer je relatie</p>}
                  </div>
                  {form.relationship === 'Anders' && (
                    <div data-error={errors.relationshipOther ? '' : undefined}>
                      <Label>Omschrijf je relatie <span className="text-red-500">*</span></Label>
                      <input type="text" value={form.relationshipOther}
                        onChange={(e) => setForm({ ...form, relationshipOther: e.target.value })}
                        placeholder="Bijv. Klant, leverancier, stagebegeleider…"
                        className={inputCls(errors.relationshipOther)} />
                      {errors.relationshipOther && <p className="text-base text-red-500 mt-1.5 font-medium">Vul je relatie in</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: AH_BLUE }} />
              <div className="p-7">
                <SectionHeader number={2} title="Samenwerking" subtitle={`Beoordeel de samenwerking met ${RECIPIENT_NAME}.`} />
                {COLLAB_QUESTIONS.map((q) => (
                  <RatingRow key={q.field} label={q.label} description={q.description}
                    field={q.field} ratings={ratings} setRatings={setRatings}
                    remarks={remarks} setRemarks={setRemarks} error={errors[q.field]} />
                ))}
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: AH_BLUE }} />
              <div className="p-7">
                <SectionHeader number={3} title="Professionele vaardigheden" subtitle={`Beoordeel de professionele kwaliteiten van ${RECIPIENT_NAME}.`} />
                {SKILLS_QUESTIONS.map((q) => (
                  <RatingRow key={q.field} label={q.label} description={q.description}
                    field={q.field} ratings={ratings} setRatings={setRatings}
                    remarks={remarks} setRemarks={setRemarks} error={errors[q.field]} />
                ))}
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: AH_BLUE }} />
              <div className="p-7">
                <SectionHeader number={4} title="Open vragen" subtitle="Neem even de tijd — deze antwoorden zijn het meest waardevol." />
                <div className="space-y-6">
                  <div data-error={errors.openGoed ? '' : undefined}>
                    <Label>Wat doet {RECIPIENT_NAME} bijzonder goed? <span className="text-red-500">*</span></Label>
                    <p className="text-base text-slate-400 mb-2 leading-relaxed">Beschrijf een concrete sterkte of situatie (Situatie–Gedrag–Effect).</p>
                    <textarea value={form.openGoed} onChange={(e) => setForm({ ...form, openGoed: e.target.value })}
                      rows={4} placeholder="" className={inputCls(errors.openGoed) + ' resize-y'} />
                    {errors.openGoed && <p className="text-base text-red-500 mt-1.5 font-medium">Dit veld is verplicht</p>}
                  </div>
                  <div data-error={errors.openGroei ? '' : undefined}>
                    <Label>Op welk gebied zou {RECIPIENT_NAME} het meest kunnen groeien? <span className="text-red-500">*</span></Label>
                    <p className="text-base text-slate-400 mb-2 leading-relaxed">Wees specifiek en geef indien mogelijk een suggestie.</p>
                    <textarea value={form.openGroei} onChange={(e) => setForm({ ...form, openGroei: e.target.value })}
                      rows={4} placeholder="" className={inputCls(errors.openGroei) + ' resize-y'} />
                    {errors.openGroei && <p className="text-base text-red-500 mt-1.5 font-medium">Dit veld is verplicht</p>}
                  </div>
                  <div>
                    <Label>Beschrijf een concrete situatie <span className="text-slate-400 font-normal text-base">(optioneel)</span></Label>
                    <p className="text-base text-slate-400 mb-2">Een positieve of negatieve samenwerking die je is bijgebleven.</p>
                    <textarea value={form.openSituatie} onChange={(e) => setForm({ ...form, openSituatie: e.target.value })}
                      rows={3} placeholder="" className={inputCls() + ' resize-y'} />
                  </div>
                  <div>
                    <Label>Welk advies wil je {RECIPIENT_NAME} meegeven? <span className="text-slate-400 font-normal text-base">(optioneel)</span></Label>
                    <textarea value={form.openAdvies} onChange={(e) => setForm({ ...form, openAdvies: e.target.value })}
                      rows={3} placeholder="" className={inputCls() + ' resize-y'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: AH_BLUE }} />
              <div className="p-7">
                <SectionHeader number={5} title="Algehele indruk" />
                <div className="space-y-7">
                  <div data-error={errors.ratAlgemeen ? '' : undefined}>
                    <Label>Algehele beoordeling <span className="text-red-500">*</span></Label>
                    <ScoreSlider value={form.ratAlgemeen} onChange={(v) => setForm({ ...form, ratAlgemeen: v })} />
                    {errors.ratAlgemeen && <p className="text-base text-red-500 mt-1.5 font-medium">Selecteer een beoordeling</p>}
                    <button type="button" onClick={() => setAlgemeenOpen((o) => !o)}
                      className="mt-3 flex items-center gap-1.5 text-base font-medium transition-colors"
                      style={{ color: algemeenOpen ? AH_BLUE : '#64748b' }}>
                      <svg className={`w-3 h-3 transition-transform ${algemeenOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {form.ratAlgemeenOpmerking ? 'Opmerking bewerken' : 'Opmerking toevoegen'} <span className="text-slate-300 font-normal">(optioneel)</span>
                    </button>
                    {algemeenOpen && (
                      <textarea value={form.ratAlgemeenOpmerking}
                        onChange={(e) => setForm({ ...form, ratAlgemeenOpmerking: e.target.value })}
                        rows={2} placeholder="Toelichting…"
                        className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 text-slate-800 placeholder-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-sky-400 transition-all resize-y" />
                    )}
                  </div>
                  <div data-error={errors.opnieuwSamenwerken ? '' : undefined}>
                    <Label>Zou je graag (opnieuw) met {RECIPIENT_NAME} willen samenwerken? <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {['Ja, zeker', 'Waarschijnlijk wel', 'Weet ik niet', 'Waarschijnlijk niet', 'Nee'].map((opt) => (
                        <button key={opt} type="button"
                          onClick={() => setForm({ ...form, opnieuwSamenwerken: opt })}
                          className={`px-4 py-2 rounded-full text-base font-semibold border transition-all duration-150 ${
                            form.opnieuwSamenwerken === opt
                              ? 'text-white border-transparent shadow'
                              : 'bg-white text-slate-500 border-sky-200 hover:border-sky-400 hover:text-sky-600'
                          }`}
                          style={form.opnieuwSamenwerken === opt ? { background: AH_BLUE } : {}}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.opnieuwSamenwerken && <p className="text-base text-red-500 mt-1.5 font-medium">Maak een keuze</p>}
                  </div>
                  <div>
                    <Label>Overige opmerkingen <span className="text-slate-400 font-normal text-base">(optioneel)</span></Label>
                    <textarea value={form.opmerking} onChange={(e) => setForm({ ...form, opmerking: e.target.value })}
                      rows={3} placeholder="" className={inputCls() + ' resize-y'} />
                  </div>
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-base text-red-600 font-medium">
                Er is iets misgegaan. Probeer het opnieuw.
              </div>
            )}

            <button type="submit" disabled={status === 'loading'}
              className="w-full text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-md"
              style={{ background: 'linear-gradient(135deg, #00ade6 0%, #0095c8 100%)', boxShadow: '0 4px 20px rgba(0,173,230,0.35)' }}>
              {status === 'loading' ? 'Versturen…' : 'Feedback versturen →'}
            </button>

            <p className="text-center text-base text-slate-400 pb-8">
              Vertrouwelijk · Persoonlijk ingezien door {RECIPIENT_NAME} · Niet gedeeld met anderen
            </p>

          </form>
        </div>
      </div>

      <footer className="py-5 text-center text-sm text-slate-400 border-t border-sky-100 bg-white">
        © {new Date().getFullYear()} · Feedback voor Ewout · Alle antwoorden worden vertrouwelijk behandeld
      </footer>
    </div>
  );
}
