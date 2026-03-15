'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const iconTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoRef.current) return;
      videoRef.current.muted = false;
      videoRef.current.play().then(() => {
        setPlaying(true);
        setMuted(false);
      }).catch(() => {
        videoRef.current!.muted = true;
        setMuted(true);
        videoRef.current!.play().then(() => setPlaying(true));
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }

  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
    setShowIcon(true);
    if (iconTimeout.current) clearTimeout(iconTimeout.current);
    iconTimeout.current = setTimeout(() => setShowIcon(false), 800);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">

      {/* ── Header ── */}
      <header className="w-full border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              E
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">Feedback voor Ewout</span>
          </div>
          <span className="text-slate-400 text-sm hidden sm:block">Vertrouwelijk · persoonlijk ingezien</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl flex flex-col items-center gap-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-indigo-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
            </span>
            Jouw mening telt
          </div>

          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
              Welkom!
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
              Geef mij eerlijke feedback over onze samenwerking. Het kost slechts&nbsp;5&nbsp;minuten.
            </p>
          </div>

          {/* Card */}
          <div className="w-full relative">

            {/* Mesh gradient blobs — behind the card */}
            <div className="absolute -inset-16 pointer-events-none -z-10 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-2/3 h-3/4 bg-indigo-600/25 rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-violet-600/25 rounded-full blur-3xl animate-blob-delay-2" />
              <div className="absolute top-0 right-1/4 w-1/2 h-1/2 bg-teal-500/15 rounded-full blur-3xl animate-blob-delay-4" />
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

            {/* Gradient top stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-600" />

            <div className="p-6">
              {/* Video */}
              <div className="relative mx-1 sm:mx-0 pb-2">
                <video
                  ref={videoRef}
                  src="/Avatar_IV_Video.mp4"
                  loop
                  playsInline
                  className="video-glow w-full rounded-3xl cursor-pointer ring-1 ring-white/20"
                  onClick={togglePlay}
                />
                {showIcon && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm animate-ping-once">
                      {playing ? (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                {/* Mute toggle */}
                <button
                  onClick={toggleMute}
                  aria-label={muted ? 'Geluid aan' : 'Geluid uit'}
                  className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full text-white transition-all hover:scale-110 shadow bg-black/50 backdrop-blur-sm border border-white/10"
                >
                  {muted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6.464-9.536a5 5 0 000 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-white/10" />

              {/* CTA */}
              <Link
                href="/feedback"
                className="flex items-center justify-center gap-2.5 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 active:scale-[0.98] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 bg-gradient-to-r from-indigo-500 to-violet-600"
              >
                Start Feedback
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <p className="mt-3 text-center text-xs text-slate-500">Vertrouwelijk · persoonlijk ingezien</p>
            </div>
          </div>{/* end inner card */}
          </div>{/* end outer relative wrapper */}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 text-center text-xs text-slate-600 border-t border-white/10">
        © {new Date().getFullYear()} · Feedback voor Ewout · Alle antwoorden worden vertrouwelijk behandeld
      </footer>
    </div>
  );
}
