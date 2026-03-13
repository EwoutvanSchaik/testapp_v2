export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center text-center max-w-3xl gap-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          ✦ Nu beschikbaar
        </span>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Mijn Amazing
          <br />
          First Test App
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed">
          Een krachtige en moderne applicatie die je dagelijkse taken vereenvoudigt.
          Gebouwd met de nieuwste technologieën voor een snelle en soepele ervaring.
        </p>

        {/* CTA button */}
        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95">
          Beginnen
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Footer hint */}
        <p className="mt-8 text-sm text-gray-600">
          Geen account nodig · Gratis te gebruiken
        </p>
      </main>
    </div>
  );
}
