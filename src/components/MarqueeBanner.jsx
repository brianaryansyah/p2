import { memo, useEffect, useRef, useState } from 'react';
import { Pause, Play, Zap } from 'lucide-react';

const skills = [
  'React & Next.js',
  'JavaScript / TypeScript',
  'Tailwind CSS',
  'RESTful APIs',
  'UI / UX Architecture',
  'Performance Tuning',
  'Web Development',
];

const SkillItem = ({ skill, dark }) => (
  <span className="group/item relative flex items-center gap-6 md:gap-14">
    <span className="relative inline-block overflow-hidden rounded-md px-2 py-1 -mx-2 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-white/10">
      <span className={`transition-colors duration-300 ${dark ? 'text-black group-hover/item:text-white' : 'text-lime-400 group-hover/item:text-white'}`}>
        {skill}
      </span>
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
    </span>
    <span className={`text-[10px] transition-all duration-300 group-hover/item:rotate-180 group-hover/item:scale-125 ${dark ? 'text-black/25 group-hover/item:text-black' : 'text-lime-400/30 group-hover/item:text-lime-400'}`}>
      {dark ? '◆' : '✦'}
    </span>
  </span>
);

/**
 * JS-driven marquee row. A requestAnimationFrame loop advances a translate3d
 * offset each frame, so the strip keeps scrolling forever and is immune to the
 * global `prefers-reduced-motion` CSS override that freezes CSS keyframes.
 * Speed is lerped toward the hover target instead of swapping the animation,
 * so boosting never causes a restart or a visible pause.
 */
const MarqueeRow = memo(function MarqueeRow({ skills, dark, direction, baseSpeed, gapClass, edgeFrom, edgeWidth, pausedRef }) {
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const speedRef = useRef(1);
  const targetRef = useRef(1);

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return undefined;

    let pos = 0;
    let raf = 0;
    let last = performance.now();
    let alive = true;

    const frame = (now) => {
      if (!alive) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      speedRef.current += (targetRef.current - speedRef.current) * Math.min(dt * 5, 1);

      if (!pausedRef.current && !document.hidden) {
        pos += baseSpeed * speedRef.current * direction * dt;
      }

      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (pos >= half) pos -= half;
        if (pos < 0) pos += half;
        track.style.transform = `translate3d(${(-pos).toFixed(2)}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) pos = pos % half;
    };
    window.addEventListener('resize', onResize);

    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [baseSpeed, direction, pausedRef]);

  return (
    <div
      ref={rowRef}
      className="overflow-hidden relative"
      onMouseEnter={() => { targetRef.current = 1.9; }}
      onMouseLeave={() => { targetRef.current = 1; }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {[...Array(2)].map((_, i) => (
          <div key={i} className={`flex shrink-0 items-center ${gapClass}`}>
            {skills.map((skill, j) => (
              <SkillItem key={j} skill={skill} dark={dark} />
            ))}
          </div>
        ))}
      </div>

      {/* Edge Fades */}
      <div className={`absolute inset-y-0 left-0 ${edgeWidth} bg-gradient-to-r ${edgeFrom} to-transparent z-10 pointer-events-none`} />
      <div className={`absolute inset-y-0 right-0 ${edgeWidth} bg-gradient-to-l ${edgeFrom} to-transparent z-10 pointer-events-none`} />
    </div>
  );
});

/**
 * Interactive marquee: hover to smoothly boost scroll speed, toggle pause via
 * the floating control chip, and every skill item reacts on hover.
 */
const MarqueeBanner = memo(function MarqueeBanner() {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  return (
    <div className="relative z-20 sm:-rotate-[0.8deg] sm:scale-[1.02] cursor-default select-none">
      <div className="bg-black shadow-[0_0_40px_rgba(163,230,53,0.08)]">

        {/* Floating control chip */}
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume scrolling' : 'Pause scrolling'}
          className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-30 flex items-center gap-1.5 rounded-full border border-lime-400/40 bg-black/80 backdrop-blur px-3 py-1.5 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.16em] text-lime-400 hover:bg-lime-400 hover:text-black transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          {paused ? <Play size={11} /> : <Pause size={11} />}
          {paused ? 'Play' : 'Pause'}
        </button>

        {/* ── Row 1: Solid Lime Text, scrolling left ── */}
        <div className="py-4 md:py-6 border-b border-neutral-800/60">
          <MarqueeRow
            skills={skills}
            dark={false}
            direction={1}
            baseSpeed={110}
            gapClass="gap-6 md:gap-14 pr-6 md:pr-14"
            edgeFrom="from-black"
            edgeWidth="w-16 md:w-32"
            pausedRef={pausedRef}
          />
        </div>

        {/* ── Row 2: Green background, scrolling right ── */}
        <div className="py-2.5 md:py-4 bg-lime-400 relative">
          <MarqueeRow
            skills={skills}
            dark
            direction={-1}
            baseSpeed={90}
            gapClass="gap-6 md:gap-12 pr-6 md:pr-12"
            edgeFrom="from-lime-400"
            edgeWidth="w-12 md:w-24"
            pausedRef={pausedRef}
          />

          {/* Scrolling indicator */}
          <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-black/50">
            <Zap size={11} className="animate-pulse" />
            live
          </div>
        </div>

      </div>
    </div>
  );
});

export default MarqueeBanner;
