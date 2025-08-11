import React, { useEffect, useRef, useState, memo } from "react";

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle?: string;
}

interface ExamAceCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
  startRank?: number;      // default 856
  targetRank?: number;     // default 100
  durationMs?: number;     // how long the whole celebration lasts (default 5200)
  blockInteraction?: boolean; // whether to prevent clicks under the modal (default true)
}

/**
 * ExamAceCelebration
 * - Pure React + Tailwind implementation
 * - SVG character climbs ladder, rank animates, canvas confetti bursts
 * - No external assets required
 */
const ExamAceCelebration = memo(function ExamAceCelebration({
  message,
  onComplete,
  startRank = 856,
  targetRank = 100,
  durationMs = 5200,
  blockInteraction = true,
}: ExamAceCelebrationProps) {
  const [step, setStep] = useState(0); // ladder step 0..stepsTotal
  const stepsTotal = 5;
  const [rank, setRank] = useState(startRank);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);
  const confettiParticlesRef = useRef<any[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const rankAnimRef = useRef<number | null>(null);

  // Easing function
  const easeOutQuad = (t: number) => t * (2 - t);

  // animate numeric rank from startRank to targetRank over given ms
  useEffect(() => {
    const animDuration = Math.min(durationMs * 0.85, 4000);
    const start = performance.now();
    const from = startRank;
    const to = Math.max(targetRank, 1);
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / animDuration);
      const eased = easeOutQuad(t);
      const value = Math.round(from + (to - from) * eased);
      setRank(value);
      if (t < 1) {
        rankAnimRef.current = requestAnimationFrame(animate);
      } else {
        setRank(to);
        rankAnimRef.current && cancelAnimationFrame(rankAnimRef.current);
      }
    };
    rankAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (rankAnimRef.current) cancelAnimationFrame(rankAnimRef.current);
    };
  }, [startRank, targetRank, durationMs]);

  // Ladder climbing steps timed
  useEffect(() => {
    let i = 0;
    const stepInterval = setInterval(() => {
      i += 1;
      setStep((s) => Math.min(stepsTotal, s + 1));
      if (i >= stepsTotal) {
        clearInterval(stepInterval);
      }
    }, Math.max(450, Math.floor(durationMs / (stepsTotal + 1))));
    return () => clearInterval(stepInterval);
  }, [durationMs]);

  // overall completion timer
  useEffect(() => {
    const t = setTimeout(() => {
      onComplete();
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onComplete]);

  // —————— Confetti (canvas) ——————
  useEffect(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.clientWidth = containerRef.current?.clientWidth ?? window.innerWidth);
    let h = (canvas.height = canvas.clientHeight = containerRef.current?.clientHeight ?? window.innerHeight);

    const colors = ["#FBBF24", "#1E3A8A", "#06B6D4", "#F97316", "#34D399"];

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // spawn particles
    confettiParticlesRef.current = [];
    const particleCount = 40;
    for (let p = 0; p < particleCount; p++) {
      confettiParticlesRef.current.push({
        x: w / 2 + random(-60, 60),
        y: h / 2 - 20 + random(-40, 40),
        size: random(6, 12),
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: random(-250, 250) / 100, // px per frame (rough)
        vy: random(-6, -2),
        rot: random(0, Math.PI * 2),
        vr: random(-0.12, 0.12),
        life: 0,
        ttl: random(1800, 3200), // ms
      });
    }

    // resize handler
    const resize = () => {
      w = canvas.width = canvas.clientWidth = containerRef.current?.clientWidth ?? window.innerWidth;
      h = canvas.height = canvas.clientHeight = containerRef.current?.clientHeight ?? window.innerHeight;
    };
    window.addEventListener("resize", resize);

    startTimeRef.current = performance.now();
    let running = true;

    const tick = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      const delta = 16.66; // assume ~60fps — we use particle.v* (per frame logic), good enough & cheaper
      confettiParticlesRef.current.forEach((pt) => {
        pt.life += delta;
        pt.x += pt.vx * (delta / 16.66) * 3;
        pt.y += (pt.vy + (pt.life / 1000) * 3) * (delta / 16.66);
        pt.vy += 0.06 * (delta / 16.66); // gravity-ish
        pt.rot += pt.vr;
        // fade out near end
        const alpha = Math.max(0, 1 - pt.life / pt.ttl);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);
        // draw small rectangle confetti (faster than complicated shapes)
        ctx.fillStyle = pt.color;
        ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size * 0.6);
        ctx.restore();
      });

      // stop after all particles lived beyond ttl
      if (confettiParticlesRef.current.every((p) => p.life >= p.ttl)) {
        running = false;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // cleanup
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      confettiParticlesRef.current = [];
    };
  }, []); // run once on mount

  // accessibility: prevent scroll when modal shown
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = blockInteraction ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [blockInteraction]);

  // transform Y for SVG student: we move by CSS transform translateY to avoid reflow
  // compute translate percent: when step = 0 -> bottom, step = stepsTotal -> near top
  const stepPercent = (step / stepsTotal) * 0.82; // fraction of the ladder height to move
  const studentTranslateY = `${-stepPercent * 100}%`; // negative moves up

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 ${
        blockInteraction ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={false}
    >
      {/* dark overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ opacity: 0.95 }}
        aria-hidden="true"
      />

      {/* Canvas confetti behind card */}
      <canvas
        ref={confettiRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Modal / Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Celebration: Task completed"
        className="relative z-20 transform transition-all duration-500 ease-out max-w-lg w-full mx-auto"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl border-4 border-yellow-300 overflow-hidden"
          style={{ boxShadow: "0 40px 90px rgba(14,30,80,0.35)" }}
        >
          {/* top header with ExamAce badge */}
          <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-800 to-sky-600">
            <div className="flex items-center space-x-3">
              {/* simple ExamAce SVG logo */}
              <div className="w-10 h-10 rounded-md bg-yellow-400 flex items-center justify-center text-blue-900 font-extrabold">
                EA
              </div>
              <div>
                <div className="text-white font-bold text-lg">ExamAce</div>
                <div className="text-yellow-200 text-xs -mt-0.5">Keep pushing. Keep climbing.</div>
              </div>
            </div>

            <div className="text-sm text-yellow-50 font-semibold">Celebration</div>
          </div>

          {/* body */}
          <div className="px-6 py-6 sm:py-8 text-center">
            {/* animated ladder + student */}
            <div className="mx-auto w-[160px] h-[240px]">
              <svg
                viewBox="0 0 120 240"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Student climbing ladder"
              >
                {/* ladder rails */}
                <line x1="30" y1="20" x2="30" y2="220" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
                <line x1="90" y1="20" x2="90" y2="220" stroke="#374151" strokeWidth="4" strokeLinecap="round" />

                {/* rungs */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const y = 200 - i * 36;
                  return (
                    <line key={i} x1="30" y1={y} x2="90" y2={y} stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
                  );
                })}

                {/* podium at top */}
                <rect x="12" y="10" width="96" height="12" rx="4" fill="#111827" opacity="0.05" />

                {/* student group - translateY controlled via style for smooth transform */}
                <g
                  style={{
                    transform: `translateY(${studentTranslateY})`,
                    transformBox: "fill-box",
                    transformOrigin: "60px 220px",
                    transition: "transform 480ms cubic-bezier(.22,.9,.36,1)",
                  }}
                >
                  {/* head */}
                  <circle cx="60" cy="198" r="9" fill="#FFD166" stroke="#C48B3F" strokeWidth="0.6" />
                  {/* body */}
                  <rect x="52" y="206" width="16" height="24" rx="3" fill="#1E40AF" />
                  {/* left arm (animated swing via CSS) */}
                  <g className="student-arm-left" style={{ transformOrigin: "54px 210px" }}>
                    <rect x="44" y="212" width="12" height="4" rx="2" fill="#1E40AF" />
                  </g>
                  {/* right arm */}
                  <g className="student-arm-right" style={{ transformOrigin: "74px 210px" }}>
                    <rect x="64" y="212" width="12" height="4" rx="2" fill="#1E40AF" />
                  </g>
                  {/* legs */}
                  <rect x="52" y="230" width="5" height="12" rx="2" fill="#0F172A" transform="rotate(6 52 230)" />
                  <rect x="63" y="230" width="5" height="12" rx="2" fill="#0F172A" transform="rotate(-6 63 230)" />
                </g>
              </svg>
            </div>

            {/* dynamic rank */}
            <div className="mt-4">
              <div
                aria-live="polite"
                className="text-4xl sm:text-5xl font-extrabold text-blue-800 tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                Rank: <span className="text-yellow-400">#{rank}</span>
              </div>
              <div className="mt-3 text-gray-700 font-semibold text-lg">{message.title}</div>
              <div className="mt-2 text-gray-500 text-sm font-mono">{message.message}</div>
              {message.subtitle && <div className="mt-1 text-gray-400 text-xs">{message.subtitle}</div>}
            </div>

            {/* CTA / success tag */}
            <div className="mt-5">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold shadow-sm">
                ✅ SUCCESS
                <span className="text-xs text-blue-800 opacity-80 ml-1">Keep going!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* small inline styles for arm swing animation - Tailwind can't express transform-origin easily for SVG subelements */}
      <style>{`
        .student-arm-left { transform-box: fill-box; animation: swingL 900ms ease-in-out infinite; }
        .student-arm-right { transform-box: fill-box; animation: swingR 900ms ease-in-out infinite; }

        @keyframes swingL {
          0% { transform: rotate(-12deg); }
          50% { transform: rotate(6deg); }
          100% { transform: rotate(-12deg); }
        }
        @keyframes swingR {
          0% { transform: rotate(8deg); }
          50% { transform: rotate(-10deg); }
          100% { transform: rotate(8deg); }
        }

        /* little entrance animation for the modal container */
        .modal-enter { transform: translateY(8px) scale(.98); opacity: 0; }
        .modal-enter-active { transform: translateY(0) scale(1); opacity: 1; transition: transform .45s cubic-bezier(.22,.9,.36,1), opacity .45s; }
      `}</style>
    </div>
  );
});

export default ExamAceCelebration;
