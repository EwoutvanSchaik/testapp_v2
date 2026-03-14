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
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F7FB' }}>

      {/* ── Header ── */}
      <header style={{ background: '#00ade6' }} className="w-full shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow"
              style={{ background: '#ff9434', color: '#00ade6' }}
            >
              E
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Feedback voor Ewout</span>
          </div>
          <span className="text-blue-200 text-sm hidden sm:block">Vertrouwelijk · persoonlijk ingezien</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm"
            style={{ background: '#E8F4FB', color: '#00ade6', border: '1.5px solid #b3d4ef' }}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#00ade6' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#00ade6' }} />
            </span>
            Jouw mening telt
          </div>

          {/* Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight" style={{ color: '#00ade6' }}>
              Welkom!
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
              Geef mij eerlijke feedback over onze samenwerking. Het kost slechts&nbsp;5&nbsp;minuten.
            </p>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">

            {/* Blue top stripe */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #00ade6, #00ade6)' }} />

            <div className="p-5">
              {/* Video */}
              <div className="relative">
                <video
                  ref={videoRef}
                  src="/Avatar_IV_Video.mp4"
                  loop
                  playsInline
                  className="w-full rounded-xl shadow-md cursor-pointer"
                  style={{ border: '2px solid #E8F4FB' }}
                  onClick={togglePlay}
                />
                {/* Play/pause flash icon */}
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
                  className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full text-white transition-all hover:scale-110 shadow"
                  style={{ background: 'rgba(0,94,173,0.85)' }}
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
              <div className="my-4 h-px bg-blue-100" />

              {/* CTA */}
              <Link
                href="/feedback"
                className="flex items-center justify-center gap-2.5 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
                style={{ background: 'linear-gradient(135deg, #00ade6 0%, #00ade6 100%)' }}
              >
                Start Feedback
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <p className="mt-3 text-center text-xs text-gray-400">Vertrouwelijk · persoonlijk ingezien</p>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 text-center text-xs text-gray-400 border-t border-blue-100 bg-white">
        © {new Date().getFullYear()} · Feedback voor Ewout · Alle antwoorden worden vertrouwelijk behandeld
      </footer>
    </div>
  );
}
