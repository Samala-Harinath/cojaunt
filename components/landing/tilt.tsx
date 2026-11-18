"use client";

import { useRef, type ReactNode } from "react";

/** A card that tilts toward the pointer. Mouse and pen only; touch screens keep it flat. */
export function Tilt({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || event.pointerType === "touch") return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.setProperty("--ty", `${(x * max * 2).toFixed(2)}deg`);
    node.style.setProperty("--tx", `${(-y * max * 2).toFixed(2)}deg`);
  }

  function leave() {
    ref.current?.style.removeProperty("--ty");
    ref.current?.style.removeProperty("--tx");
  }

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>
      {children}
    </div>
  );
}
