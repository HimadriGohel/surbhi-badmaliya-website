"use client";

import { useEffect, type RefObject } from "react";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Pins the page while the hero is at the top and turns wheel / touch / keyboard input into a 0→1
 * progress value (eased), passed to `onFrame` every animation frame. At progress 1 a further push
 * forward releases the page; scrolling back to the very top re-engages it. Same body-pinning
 * technique as components/ui/scroll-locked-video-hero.tsx. Reduced motion: never locks, renders the end state.
 */
export function useScrollScrub(sectionRef: RefObject<HTMLElement | null>, onFrame: (p: number, started: boolean) => void, scrubDistance = 3200) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { onFrame(1, true); return; }

    let target = 0, current = 0, started = false, locked = false, lockedY = 0, touchY = 0, raf = 0;

    const lock = () => {
      if (locked) return;
      locked = true;
      lockedY = window.scrollY;
      Object.assign(document.body.style, { position: "fixed", top: `-${lockedY}px`, left: "0", right: "0", width: "100%", height: "100%", overscrollBehavior: "none" });
    };
    const release = () => {
      if (!locked) return;
      locked = false;
      Object.assign(document.body.style, { position: "", top: "", left: "", right: "", width: "", height: "", overscrollBehavior: "" });
      window.scrollTo(0, lockedY);
    };
    if (window.scrollY <= 0) lock();

    const add = (dy: number) => {
      if (!locked) {
        if (dy < 0 && window.scrollY <= 0) lock();
        else return false;
      }
      if (dy > 0 && target >= 1 && current > 0.98) { release(); return false; }
      target = clamp(target + dy / scrubDistance, 0, 1);
      if (target > 0.001) started = true;
      return true;
    };

    const onWheel = (e: WheelEvent) => { if (add(e.deltaY)) e.preventDefault(); };
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      touchY = y;
      if (add(dy)) e.preventDefault();
    };
    const keys: Record<string, number> = { ArrowDown: 120, ArrowUp: -120, PageDown: 600, PageUp: -600, " ": 600, End: 99999, Home: -99999 };
    const onKey = (e: KeyboardEvent) => {
      const d = keys[e.key];
      if (d === undefined || (e.target as HTMLElement)?.closest?.("input,textarea,select,[contenteditable]")) return;
      if (add(e.shiftKey && e.key === " " ? -d : d)) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    section.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    section.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    const frame = () => {
      current += (target - current) * 0.12;
      onFrame(current, started);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      section.removeEventListener("touchstart", onTouchStart, true);
      section.removeEventListener("touchmove", onTouchMove, true);
      cancelAnimationFrame(raf);
      release();
    };
    // onFrame only writes to refs, so a stale closure is fine
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrubDistance]);
}
