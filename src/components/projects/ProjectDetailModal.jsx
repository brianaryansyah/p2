import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Gsap, GsapPresence } from "../../utils/gsapAnimate";
import ProjectDetailRouter from "./ProjectDetailRouter";

export default function ProjectDetailModal() {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previouslyFocused = document.activeElement;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Move focus into the dialog so keyboard users start inside it.
    const panel = panelRef.current;
    if (panel) panel.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate(-1);
        return;
      }

      // Trap Tab / Shift+Tab within the dialog.
      if (event.key !== "Tab") return;
      const focusables = panel?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [navigate]);

  return (
    <GsapPresence>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-0 md:p-6 lg:p-10">
        <Gsap.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
        <Gsap.div
          ref={panelRef}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label="Project detail"
          tabIndex={-1}
          className="relative z-10 w-full h-full md:h-auto md:max-h-[90vh] max-w-6xl bg-[#FAF9F6] shadow-2xl md:rounded-lg overflow-y-auto overscroll-contain flex flex-col outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <ProjectDetailRouter mode="modal" />
        </Gsap.div>
      </div>
    </GsapPresence>
  );
}
