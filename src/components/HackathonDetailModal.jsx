import { useEffect, useRef } from 'react';
import { Gsap, GsapPresence } from '../utils/gsapAnimate';
import { createPortal } from 'react-dom';
import { X, Trophy, Github, Globe, Users, Zap } from 'lucide-react';

/* ─── Subcomponents ─────────────────────────────────────── */
const TechBadge = ({ children }) => (
    <span className="px-3 py-1.5 bg-black/5 font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-black/80">
        {children}
    </span>
);

/* ─── Main Modal ────────────────────────────────────────── */
export default function HackathonDetailModal({ isOpen, onClose, achievement }) {
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);

    const a = achievement || {};
    const title = a.title || 'Achievement';
    const track = a.track || 'Hackathon';
    const project = a.project || '';
    const description = a.description || '';
    const team = a.team || '';
    const techStack = Array.isArray(a.techStack) ? a.techStack : [];
    const links = a.links || {};
    const descriptionBlocks = description.split(/\n+/).map((s) => s.trim()).filter(Boolean);

    const primaryUrl = links.live || links.github || links.devfolio || '';

    // Lock body scroll
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    // Escape key + focus management
    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement;
        if (closeButtonRef.current) closeButtonRef.current.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;
            const focusables = panelRef.current?.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (!focusables || focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };
    }, [isOpen, onClose]);

    return createPortal(
        <GsapPresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 lg:p-10">
                    {/* Backdrop */}
                    <Gsap.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal content */}
                    <Gsap.div
                        ref={panelRef}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        data-lenis-prevent
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="hackathon-modal-title"
                        tabIndex={-1}
                        className="relative z-10 w-full h-full md:h-auto md:max-h-[90vh] max-w-4xl bg-[#FAF9F6] shadow-2xl md:rounded-lg overflow-y-auto overscroll-contain flex flex-col outline-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ── Sticky header ─────────────────────── */}
                        <div className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-black/5">
                            <div className="px-6 md:px-10 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] md:tracking-[0.16em] text-[#000] flex items-center gap-2">
                                        <Trophy size={14} className="text-lime-500" />
                                        {track}
                                    </span>
                                </div>
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* ── Content body ──────────────────────── */}
                        <div className="px-6 md:px-10 pt-10 pb-20 space-y-12">

                            {/* Title block */}
                            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                                {project && (
                                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-black/40 mb-4">
                                        {project}
                                    </p>
                                )}

                                <h1 id="hackathon-modal-title" className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-black mb-6 break-words">
                                    {title}
                                </h1>

                                {descriptionBlocks.length > 0 && (
                                    <p className="text-base md:text-lg leading-7 md:leading-8 text-black/60 max-w-2xl mx-auto">
                                        {descriptionBlocks[0]}
                                    </p>
                                )}

                                {/* Action links */}
                                {(primaryUrl || links.github || links.devfolio || links.live) && (
                                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                                        {links.live && (
                                            <a href={links.live} target="_blank" rel="noreferrer"
                                                className="bg-lime-400 text-black px-8 py-3.5 font-bold uppercase text-xs tracking-wider hover:bg-black hover:text-white transition-all duration-300 rounded-[2px] flex items-center gap-2">
                                                <Globe size={16} /> Live Site
                                            </a>
                                        )}
                                        {(links.github ) && (
                                            <a href={links.github} target="_blank" rel="noreferrer"
                                                className="bg-black/5 text-black px-8 py-3.5 font-bold uppercase text-xs tracking-wider border border-transparent hover:border-black/20 transition-all duration-300 rounded-[2px] flex items-center gap-2">
                                                <Github size={16} /> Repository
                                            </a>
                                        )}
                                        {(links.devfolio) && (
                                            <a href={links.devfolio} target="_blank" rel="noreferrer"
                                                className="bg-black text-white px-8 py-3.5 font-bold uppercase text-xs tracking-wider hover:bg-lime-400 hover:text-black transition-all duration-300 rounded-[2px] flex items-center gap-2">
                                                <Zap size={16} /> Submission
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Description body */}
                            {descriptionBlocks.length > 1 && (
                                <div className="max-w-5xl mx-auto border-t border-black/10 pt-12 space-y-6">
                                    {descriptionBlocks.slice(1).map((block, i) => (
                                        <p key={i} className="text-sm md:text-base leading-relaxed text-black/70">
                                            {block}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {/* Meta / team / stack */}
                            {(team || techStack.length > 0) && (
                                <div className="max-w-5xl mx-auto border-t border-black/10 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    {team ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-black/40 tracking-[0.12em] md:tracking-[0.16em]">TEAM:</span>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <Users size={14} className="text-black/40" />
                                                <span className="font-semibold text-sm text-black/80">{team}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span />
                                    )}

                                    {techStack.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {techStack.map(t => <TechBadge key={t}>{t}</TechBadge>)}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </Gsap.div>
                </div>
            )}
        </GsapPresence>,
        document.body
    );
}