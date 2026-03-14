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
        // Browser blocked unmuted autoplay — fall back to muted
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
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 py-20 overflow-hidden">

      {/* ── Background atmosphere ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow – top centre */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-600/20 blur-[140px]" />
        {/* Secondary glow – bottom left */}
        <div className="absolute bottom-0 -left-40 w-[500px] h-[400px] rounded-full bg-violet-700/15 blur-[120px]" />
        {/* Accent – right */}
        <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] rounded-full bg-sky-600/10 blur-[100px]" />
        {/* Noise / grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl gap-9">

        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 backdrop-blur-sm px-5 py-2 text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-900/30">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
          </span>
          Jouw mening telt
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1
            className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-[1.05]"
            style={{
              background: 'linear-gradient(140deg, #ffffff 0%, #c7d2fe 45%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welkom!
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xs mx-auto">
            Geef mij eerlijke feedback over onze samenwerking. Het kost slechts&nbsp;5&nbsp;minuten.
          </p>
        </div>

        {/* ── Glass card: video + controls ── */}
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-2xl shadow-black/40">

          {/* Floating video */}
          <div className="relative">
            {/* Glow behind video */}
            <div className="absolute -inset-3 rounded-2xl bg-indigo-600/25 blur-2xl -z-10" />
            <video
              ref={videoRef}
              src="/Avatar_IV_Video.mp4"
              loop
              playsInline
              className="w-full rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] ring-1 ring-white/10 cursor-pointer"
              onClick={togglePlay}
            />
            {/* Play/pause flash icon */}
            {showIcon && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm animate-ping-once">
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
              className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-110"
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
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* CTA */}
          <Link
            href="/feedback"
            className="group relative flex items-center justify-center gap-2.5 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          >
            {/* Glow layer */}
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            />
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
              style={{ boxShadow: '0 0 32px 8px rgba(99,102,241,0.5)' }}
            />
            Start Feedback
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className="mt-3 text-center text-xs text-white/25">Vertrouwelijk · persoonlijk ingezien</p>
        </div>

      </div>
    </div>
  );
}
