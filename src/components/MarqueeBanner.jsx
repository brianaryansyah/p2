import { memo, useState } from 'react';
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

const BASE_DURATIONS = { left: 28, right: 32 };

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
 * Interactive marquee: hover to boost scroll speed, toggle pause via the
 * floating control chip, and every skill item reacts on hover.
 */
const MarqueeBanner = memo(function MarqueeBanner() {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  const marqueeStyle = (key) => ({
    animation: `${key} ${BASE_DURATIONS[key] / speed}s linear infinite`,
    animationPlayState: paused ? 'paused' : 'running',
  });

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
        <div
          className="py-4 md:py-6 overflow-hidden relative border-b border-neutral-800/60"
          onMouseEnter={() => setSpeed(1.9)}
          onMouseLeave={() => setSpeed(1)}
        >
          <div
            className="flex whitespace-nowrap gap-6 md:gap-14 will-change-transform"
            style={marqueeStyle('marquee-scroll-left')}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-6 md:gap-14 text-lg sm:text-2xl md:text-4xl font-black uppercase items-center">
                {skills.map((skill, j) => (
                  <SkillItem key={j} skill={skill} dark={false} />
                ))}
              </div>
            ))}
          </div>

          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>

        {/* ── Row 2: Green background, scrolling right ── */}
        <div
          className="py-2.5 md:py-4 bg-lime-400 overflow-hidden relative"
          onMouseEnter={() => setSpeed(1.9)}
          onMouseLeave={() => setSpeed(1)}
        >
          <div
            className="flex whitespace-nowrap gap-6 md:gap-12 will-change-transform"
            style={marqueeStyle('marquee-scroll-right')}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-6 md:gap-12 text-base sm:text-lg md:text-2xl font-black uppercase items-center">
                {skills.map((skill, j) => (
                  <SkillItem key={j} skill={skill} dark />
                ))}
              </div>
            ))}
          </div>

          {/* Scrolling indicator */}
          <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-black/50">
            <Zap size={11} className="animate-pulse" />
            live
          </div>

          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-lime-400 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-lime-400 to-transparent z-10 pointer-events-none" />
        </div>

      </div>
    </div>
  );
});

export default MarqueeBanner;
