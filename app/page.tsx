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
    <div className="min-h-screen flex flex-col bg-[#f0f7fb]">

      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow object-cover" />
            <span className="font-extrabold text-lg tracking-tight text-slate-800">Feedback voor Ewout</span>
          </div>
          <span className="text-slate-400 text-sm hidden sm:block">Vertrouwelijk · persoonlijk ingezien</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl flex flex-col items-center gap-10">

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
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
              Welkom!
            </h1>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
              Geef mij eerlijke feedback over onze samenwerking. Het kost slechts&nbsp;5&nbsp;minuten.
            </p>
          </div>

          {/* Card */}
          <div className="w-full relative">

            {/* Soft blobs behind card */}
            <div className="absolute -inset-16 pointer-events-none -z-10 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-2/3 h-3/4 rounded-full blur-3xl animate-blob" style={{ background: 'rgba(0,173,230,0.08)' }} />
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-full blur-3xl animate-blob-delay-2" style={{ background: 'rgba(99,102,241,0.06)' }} />
            </div>

            <div className="bg-white rounded-2xl border border-sky-100 shadow-lg overflow-hidden">
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00ade6, #6366f1)' }} />

              <div className="p-6">
                {/* Video */}
                <div className="relative mx-1 sm:mx-0 pb-2">
                  <video
                    ref={videoRef}
                    src="/V2.mp4"
                    loop
                    playsInline
                    className="video-glow w-1/2 mx-auto block rounded-3xl cursor-pointer ring-1 ring-sky-200"
                    onClick={togglePlay}
                  />
                  {showIcon && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm animate-ping-once">
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
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? 'Geluid aan' : 'Geluid uit'}
                    className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full text-white transition-all hover:scale-110 shadow"
                    style={{ background: 'rgba(0,94,173,0.75)' }}
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

                <div className="my-5 h-px bg-sky-100" />

                {/* CTA */}
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

        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-400 border-t border-sky-100 bg-white">
        © {new Date().getFullYear()} · Feedback voor Ewout · Alle antwoorden worden vertrouwelijk behandeld
      </footer>
    </div>
  );
}
