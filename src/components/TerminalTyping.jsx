import { useEffect, useRef, useState } from 'react';

const LINES = [
  { prompt: '$', text: 'whoami' },
  { prompt: '>', text: 'brian@dev — full-stack & ai' },
  { prompt: '$', text: 'pwd' },
  { prompt: '>', text: '~/portfolio/engineer' },
  { prompt: '$', text: './deploy --env=production' },
  { prompt: '>', text: 'build ok · 8 projects · 0 errors' },
];

const TYPE_MS = 34;
const LINE_GAP_MS = 420;
const FINAL_PAUSE_MS = 2600;

/**
 * Signature live terminal that types a small deploy sequence.
 * Loops forever; pauses when scrolled out of view or reduced motion.
 */
const TerminalTyping = ({ className = '' }) => {
  const rootRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [typing, setTyping] = useState(true);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  useEffect(() => {
    if (reducedMotion) {
      setLines(LINES.map((l) => ({ ...l, typed: l.text })));
      setTyping(false);
      return undefined;
    }

    let cancelled = false;
    let timer = null;

    const typeLine = (lineIdx, charIdx) => {
      if (cancelled) return;
      const line = LINES[lineIdx];
      const typed = line.text.slice(0, charIdx);
      setLines((prev) => {
        const next = [...prev];
        next[lineIdx] = { ...line, typed };
        return next;
      });

      if (charIdx <= line.text.length) {
        timer = setTimeout(() => typeLine(lineIdx, charIdx + 1), TYPE_MS);
      } else {
        timer = setTimeout(() => {
          if (lineIdx + 1 < LINES.length) {
            typeLine(lineIdx + 1, 0);
          } else {
            setTyping(false);
            timer = setTimeout(() => {
              if (cancelled) return;
              setLines([]);
              setTyping(true);
              typeLine(0, 0);
            }, FINAL_PAUSE_MS);
          }
        }, LINE_GAP_MS);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!timer && !cancelled) typeLine(0, 0);
          } else {
            clearTimeout(timer);
            timer = null;
          }
        });
      },
      { threshold: 0.4 }
    );
    if (rootRef.current) io.observe(rootRef.current);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      io.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`${className} w-full max-w-md mx-auto font-mono text-left text-[11px] sm:text-xs leading-relaxed bg-black/90 text-lime-400/90 border border-black/10 rounded-md px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]`}
      aria-label="Live terminal demo"
    >
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2 whitespace-pre-wrap break-all">
          <span className="text-lime-500 font-bold shrink-0">{line.prompt}</span>
          <span>{line.typed || ''}</span>
        </div>
      ))}
      <span className="inline-block w-2 h-3.5 bg-lime-400 align-middle animate-pulse" />
    </div>
  );
};

export default TerminalTyping;
