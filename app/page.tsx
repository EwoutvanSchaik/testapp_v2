'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7fb]">

      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow object-cover" />
            <span className="font-extrabold text-base tracking-tight text-slate-800">Feedback voor Ewout</span>
          </div>
          <span className="text-slate-400 text-sm hidden sm:block">Vertrouwelijk · persoonlijk ingezien</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md flex flex-col items-center gap-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-sky-50 text-[#00ade6] border border-sky-200">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#00ade6' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#00ade6' }} />
            </span>
            Jouw mening telt
          </div>

          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Welkom!
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              Geef mij eerlijke feedback over onze samenwerking. Het kost slechts&nbsp;5&nbsp;minuten.
            </p>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-2xl border border-sky-100 shadow-lg overflow-hidden">
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00ade6, #6366f1)' }} />
            <div className="p-6">
              <Link
                href="/feedback"
                className="flex items-center justify-center gap-2.5 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 active:scale-[0.98] shadow-md"
                style={{ background: 'linear-gradient(135deg, #00ade6 0%, #0095c8 100%)', boxShadow: '0 4px 20px rgba(0,173,230,0.35)' }}
              >
                Start Feedback
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="mt-3 text-center text-xs text-slate-400">Vertrouwelijk · persoonlijk ingezien</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-400 border-t border-sky-100 bg-white">
        © {new Date().getFullYear()} · Feedback voor Ewout · Alle antwoorden worden vertrouwelijk behandeld
      </footer>
    </div>
  );
}
