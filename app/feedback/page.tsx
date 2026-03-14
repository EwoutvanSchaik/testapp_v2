'use client';

import { useState } from 'react';

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

/* ── Score Slider (1–10) ── */
function ScoreSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const pct = value > 0 ? ((value - 1) / 9) * 100 : 0;
  const color =
    value === 0 ? '#4b5563'
    : value <= 3 ? '#ef4444'
    : value <= 5 ? '#f97316'
    : value <= 7 ? '#eab308'
    : '#22c55e';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-base text-white/30">1</span>
        {value > 0 ? (
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-extrabold tabular-nums"
              style={{ color }}
            >
              {value}
            </span>
            <span
              className="text-base font-semibold px-2.5 py-1 rounded-full border"
              style={{ color, borderColor: `${color}40`, background: `${color}15` }}
            >
              {SCORE_LABEL(value)}
            </span>
          </div>
        ) : (
          <span className="text-base text-white/25 italic">Nog niet beoordeeld</span>
        )}
        <span className="text-base text-white/30">10</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-2 rounded-full bg-white/8" />
        {value > 0 && (
          <div
            className="absolute h-2 rounded-full transition-all duration-150"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, #6366f1, ${color})` }}
          />
        )}
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value > 0 ? value : 1}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => { if (value === 0) onChange(5); }}
          onTouchStart={() => { if (value === 0) onChange(5); }}
          className="relative w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-black/40 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
        />
      </div>
      <div className="flex justify-between px-0.5">
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <span
            key={n}
            className="text-sm tabular-nums transition-colors duration-100"
            style={{ color: value === n ? color : 'rgba(255,255,255,0.2)' }}
          >
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
    <div className="flex items-start gap-4 mb-7">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
      >
        {number}
      </div>
      <div className="pt-0.5">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-lg text-white/40 mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ── Rating row with optional remark ── */
function RatingRow({ label, description, field, ratings, setRatings, remarks, setRemarks, error }: {
  label: string; description: string; field: string;
  ratings: Record<string, number>; setRatings: (r: Record<string, number>) => void;
  remarks: Record<string, string>; setRemarks: (r: Record<string, string>) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`py-4 border-b border-white/5 last:border-0 ${error ? 'rounded-xl bg-red-500/8 border-red-400/20 px-4 -mx-4 border' : ''}`}>
      <div className="mb-3">
        <p className="text-lg font-semibold text-white/90">{label}</p>
        <p className="text-base text-white/35 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <ScoreSlider value={ratings[field] ?? 0} onChange={(v) => setRatings({ ...ratings, [field]: v })} />
      {error && <p className="text-base text-red-400 mt-1.5 font-medium">Selecteer een beoordeling</p>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex items-center gap-1.5 text-base text-white/35 hover:text-white/60 transition-colors"
      >
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {remarks[field] ? 'Opmerking bewerken' : 'Opmerking toevoegen'} <span className="text-white/20">(optioneel)</span>
      </button>
      {open && (
        <textarea
          value={remarks[field] ?? ''}
          onChange={(e) => setRemarks({ ...remarks, [field]: e.target.value })}
          rows={2}
          placeholder="Toelichting…"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/20 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all hover:border-white/20 resize-y"
        />
      )}
    </div>
  );
}

/* ── Field label ── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-lg font-semibold text-white/80 mb-1.5">{children}</label>;
}

/* ── Input base classes ── */
const inputCls = (err?: boolean) =>
  `w-full rounded-xl border bg-white/5 text-white placeholder-white/20 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all ${
    err ? 'border-red-400/40 bg-red-500/8' : 'border-white/10 hover:border-white/20'
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

  /* ── Success screen ── */
  if (status === 'success') {
    const gif = GIFS[Math.floor(Math.random() * GIFS.length)];
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl shadow-black/50">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}
          >
            🎉
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">Bedankt voor je feedback!</h1>
          <p className="text-white/40 mb-7 leading-relaxed text-sm">
            Je inzending is ontvangen. {RECIPIENT_NAME} zal de feedback persoonlijk inzien.
          </p>
          <img src={gif} alt="Bedankt!" width={300} className="mx-auto rounded-2xl shadow-xl shadow-black/40 ring-1 ring-white/10" />
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 relative overflow-hidden">

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-700/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      {/* Sticky progress bar */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-md mb-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          {SECTIONS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
              >
                {i + 1}
              </div>
              <span className="text-base font-medium text-white/40 hidden sm:block">{s}</span>
              {i < SECTIONS.length - 1 && <div className="w-5 h-px bg-white/10 ml-1 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(140deg, #ffffff 0%, #c7d2fe 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Feedbackformulier
          </h1>
          <p className="mt-3 text-white/40 text-lg max-w-xs mx-auto leading-relaxed">
            Jouw antwoorden worden vertrouwelijk en persoonlijk ingezien door {RECIPIENT_NAME}.
          </p>
          <p className="mt-1.5 text-base text-white/20">Velden met * zijn verplicht</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* ── Section 1: Gegevens ── */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-md p-7">
            <SectionHeader number={1} title="Jouw gegevens" subtitle="Wie geeft deze feedback?" />
            <div className="space-y-4">
              <div>
                <Label>Naam <span className="text-white/30 font-normal text-base">(optioneel)</span></Label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Voor- en achternaam" className={inputCls()} />
              </div>
              <div data-error={errors.relationship ? '' : undefined}>
                <Label>Mijn relatie tot {RECIPIENT_NAME} <span className="text-red-400">*</span></Label>
                <select value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className={inputCls(errors.relationship)}>
                  <option value="" className="bg-slate-900">Selecteer een optie</option>
                  {['Directe collega (zelfde team)', 'Collega (andere afdeling)', 'Leidinggevende', 'Stakeholder / opdrachtgever intern', 'Projectpartner', 'Anders'].map(o => (
                    <option key={o} className="bg-slate-900">{o}</option>
                  ))}
                </select>
                {errors.relationship && <p className="text-base text-red-400 mt-1.5 font-medium">Selecteer je relatie</p>}
              </div>
              {form.relationship === 'Anders' && (
                <div data-error={errors.relationshipOther ? '' : undefined}>
                  <Label>Omschrijf je relatie <span className="text-red-400">*</span></Label>
                  <input type="text" value={form.relationshipOther}
                    onChange={(e) => setForm({ ...form, relationshipOther: e.target.value })}
                    placeholder="Bijv. Klant, leverancier, stagebegeleider…"
                    className={inputCls(errors.relationshipOther)} />
                  {errors.relationshipOther && <p className="text-base text-red-400 mt-1.5 font-medium">Vul je relatie in</p>}
                </div>
              )}
            </div>
          </div>

          {/* ── Section 2: Samenwerking ── */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-md p-7">
            <SectionHeader number={2} title="Samenwerking" subtitle={`Beoordeel de samenwerking met ${RECIPIENT_NAME}.`} />
            {COLLAB_QUESTIONS.map((q) => (
              <RatingRow key={q.field} label={q.label} description={q.description}
                field={q.field} ratings={ratings} setRatings={setRatings}
                remarks={remarks} setRemarks={setRemarks} error={errors[q.field]} />
            ))}
          </div>

          {/* ── Section 3: Vaardigheden ── */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-md p-7">
            <SectionHeader number={3} title="Professionele vaardigheden" subtitle={`Beoordeel de professionele kwaliteiten van ${RECIPIENT_NAME}.`} />
            {SKILLS_QUESTIONS.map((q) => (
              <RatingRow key={q.field} label={q.label} description={q.description}
                field={q.field} ratings={ratings} setRatings={setRatings}
                remarks={remarks} setRemarks={setRemarks} error={errors[q.field]} />
            ))}
          </div>

          {/* ── Section 4: Open vragen ── */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-md p-7">
            <SectionHeader number={4} title="Open vragen" subtitle="Neem even de tijd — deze antwoorden zijn het meest waardevol." />
            <div className="space-y-6">
              <div data-error={errors.openGoed ? '' : undefined}>
                <Label>Wat doet {RECIPIENT_NAME} bijzonder goed? <span className="text-red-400">*</span></Label>
                <p className="text-base text-white/30 mb-2 leading-relaxed">Beschrijf een concrete sterkte of situatie (Situatie–Gedrag–Effect).</p>
                <textarea value={form.openGoed} onChange={(e) => setForm({ ...form, openGoed: e.target.value })}
                  rows={4} placeholder=""
                  className={inputCls(errors.openGoed) + ' resize-y'} />
                {errors.openGoed && <p className="text-base text-red-400 mt-1.5 font-medium">Dit veld is verplicht</p>}
              </div>
              <div data-error={errors.openGroei ? '' : undefined}>
                <Label>Op welk gebied zou {RECIPIENT_NAME} het meest kunnen groeien? <span className="text-red-400">*</span></Label>
                <p className="text-base text-white/30 mb-2 leading-relaxed">Wees specifiek en geef indien mogelijk een suggestie.</p>
                <textarea value={form.openGroei} onChange={(e) => setForm({ ...form, openGroei: e.target.value })}
                  rows={4} placeholder=""
                  className={inputCls(errors.openGroei) + ' resize-y'} />
                {errors.openGroei && <p className="text-base text-red-400 mt-1.5 font-medium">Dit veld is verplicht</p>}
              </div>
              <div>
                <Label>Beschrijf een concrete situatie <span className="text-white/25 font-normal text-xs">(optioneel)</span></Label>
                <p className="text-base text-white/30 mb-2">Een positieve of negatieve samenwerking die je is bijgebleven.</p>
                <textarea value={form.openSituatie} onChange={(e) => setForm({ ...form, openSituatie: e.target.value })}
                  rows={3} className={inputCls() + ' resize-y'} />
              </div>
              <div>
                <Label>Welk advies wil je {RECIPIENT_NAME} meegeven? <span className="text-white/25 font-normal text-xs">(optioneel)</span></Label>
                <textarea value={form.openAdvies} onChange={(e) => setForm({ ...form, openAdvies: e.target.value })}
                  rows={3} placeholder=""
                  className={inputCls() + ' resize-y'} />
              </div>
            </div>
          </div>

          {/* ── Section 5: Algehele indruk ── */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-md p-7">
            <SectionHeader number={5} title="Algehele indruk" />
            <div className="space-y-7">
              <div data-error={errors.ratAlgemeen ? '' : undefined}>
                <Label>Algehele beoordeling <span className="text-red-400">*</span></Label>
                <ScoreSlider value={form.ratAlgemeen} onChange={(v) => setForm({ ...form, ratAlgemeen: v })} />
                {errors.ratAlgemeen && <p className="text-base text-red-400 mt-1.5 font-medium">Selecteer een beoordeling</p>}
                <button
                  type="button"
                  onClick={() => setAlgemeenOpen((o) => !o)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
                >
                  <svg className={`w-3 h-3 transition-transform ${algemeenOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {form.ratAlgemeenOpmerking ? 'Opmerking bewerken' : 'Opmerking toevoegen'} <span className="text-white/20">(optioneel)</span>
                </button>
                {algemeenOpen && (
                  <textarea
                    value={form.ratAlgemeenOpmerking}
                    onChange={(e) => setForm({ ...form, ratAlgemeenOpmerking: e.target.value })}
                    rows={2}
                    placeholder="Toelichting…"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all hover:border-white/20 resize-y"
                  />
                )}
              </div>
              <div data-error={errors.opnieuwSamenwerken ? '' : undefined}>
                <Label>Zou je graag (opnieuw) met {RECIPIENT_NAME} willen samenwerken? <span className="text-red-400">*</span></Label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {['Ja, zeker', 'Waarschijnlijk wel', 'Weet ik niet', 'Waarschijnlijk niet', 'Nee'].map((opt) => (
                    <button key={opt} type="button"
                      onClick={() => setForm({ ...form, opnieuwSamenwerken: opt })}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
                        form.opnieuwSamenwerken === opt
                          ? 'text-white border-transparent shadow-lg'
                          : 'bg-transparent text-white/50 border-white/10 hover:border-white/25 hover:text-white/80'
                      }`}
                      style={form.opnieuwSamenwerken === opt
                        ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }
                        : {}}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.opnieuwSamenwerken && <p className="text-base text-red-400 mt-1.5 font-medium">Maak een keuze</p>}
              </div>
              <div>
                <Label>Overige opmerkingen <span className="text-white/25 font-normal text-xs">(optioneel)</span></Label>
                <textarea value={form.opmerking} onChange={(e) => setForm({ ...form, opmerking: e.target.value })}
                  rows={3} placeholder="Alles wat je verder nog kwijt wilt…"
                  className={inputCls() + ' resize-y'} />
              </div>
            </div>
          </div>

          {/* Error banner */}
          {status === 'error' && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-400 font-medium">
              Er is iets misgegaan. Probeer het opnieuw.
            </div>
          )}

          {/* Submit */}
          <div className="relative group">
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-lg -z-10"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full text-white font-bold py-4 rounded-2xl text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {status === 'loading' ? 'Versturen…' : 'Feedback versturen →'}
            </button>
          </div>

          <p className="text-center text-base text-white/20 pb-8">
            Vertrouwelijk · Persoonlijk ingezien door {RECIPIENT_NAME} · Niet gedeeld met anderen
          </p>

        </form>
      </div>
    </div>
  );
}
