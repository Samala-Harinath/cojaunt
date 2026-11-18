"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades a block in as it scrolls into view. The server renders it visible, so without JavaScript
 * (or for anything already on screen) nothing is hidden. Only blocks below the fold are hidden after
 * load, then revealed once. Uses the DOM directly, so scrolling never re-renders React.
 */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    node.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        // Next frame, so the hidden state is painted first and the change animates.
        requestAnimationFrame(() => {
          node.dataset.reveal = "shown";
        });
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const props = { ref: ref as never, className, style: delay ? ({ "--delay": `${delay}s` } as React.CSSProperties) : undefined };
  return <Tag {...props}>{children}</Tag>;
}
