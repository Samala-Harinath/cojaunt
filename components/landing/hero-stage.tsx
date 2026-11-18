"use client";

import { useRef } from "react";
import { Icon } from "@/components/icon";
import { Scene } from "@/components/scene";

type Props = { title: string; place: string; when: string; price: string; going: number };

const people = [
  { initial: "R", bg: "#e9a07a" },
  { initial: "D", bg: "#7fb5a0" },
  { initial: "N", bg: "#b79ad4" },
];

/**
 * The hero artwork: layered cards in real 3D space (CSS perspective and translateZ).
 * It turns gently toward the pointer on desktop and floats on its own everywhere else.
 * Everything in it is an illustration, hidden from screen readers.
 */
export function HeroStage({ title, place, when, price, going }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || event.pointerType === "touch") return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.setProperty("--ry", `${(-12 + x * 18).toFixed(2)}deg`);
    node.style.setProperty("--rx", `${(6 - y * 14).toFixed(2)}deg`);
  }

  function leave() {
    ref.current?.style.removeProperty("--ry");
    ref.current?.style.removeProperty("--rx");
  }

  return (
    <div className="stage relative mx-auto aspect-[1/1.05] w-full max-w-[34rem]" onPointerMove={move} onPointerLeave={leave} aria-hidden="true">
      {/* Soft light behind everything */}
      <div className="blob absolute -left-6 top-6 size-64 rounded-full bg-marigold/30 blur-3xl" />
      <div className="blob absolute -right-4 bottom-4 size-72 rounded-full bg-forest/25 blur-3xl" style={{ animationDelay: "-6s" }} />

      <div ref={ref} className="stage-inner size-full">
        {/* Orbit ring with a travelling dot */}
        <div className="layer orbit absolute inset-[3%] rounded-full border border-dashed border-forest/30" style={{ ["--z" as string]: "-60px" }}>
          <span className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold shadow-[0_0_0_6px_rgb(237_160_47/0.2)]" />
          <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-forest" />
        </div>

        {/* Back card */}
        <div className="layer float absolute right-[2%] top-[4%] w-[46%]" style={{ ["--z" as string]: "-20px", ["--t" as string]: "7s", ["--d" as string]: "-2s" }}>
          <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
            <Scene name="coast" className="h-28 w-full" />
            <div className="space-y-1.5 p-3.5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted">Weekend · Goa</p>
              <p className="font-display text-base leading-tight">Sunset beach hop</p>
              <div className="h-1.5 w-2/3 rounded-full bg-line" />
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="layer float absolute left-[2%] top-[18%] w-[66%]" style={{ ["--z" as string]: "50px", ["--t" as string]: "6.5s" }}>
          <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_40px_80px_-24px_rgb(20_52_41/0.55)]">
            <div className="relative">
              <Scene name="hills" className="h-44 w-full" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-2.5 py-1 text-[0.6875rem] font-bold text-ink shadow-sm">
                <Icon name="people" className="size-3.5 text-forest" />
                Group trip
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur-sm">{when}</span>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="font-display text-xl leading-tight">{title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <Icon name="pin" className="size-3.5" />
                  {place}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {people.map((p) => (
                    <span key={p.initial} className="-ml-2 grid size-8 place-items-center rounded-full border-2 border-surface text-xs font-bold text-night first:ml-0" style={{ background: p.bg }}>
                      {p.initial}
                    </span>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-muted">+{going} going</span>
                </div>
                <p className="text-base font-bold">{price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating chips, nearest the viewer */}
        <div className="layer float absolute right-[0%] top-[40%]" style={{ ["--z" as string]: "130px", ["--t" as string]: "5s", ["--d" as string]: "-1s" }}>
          <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-xl">
            <span className="grid size-8 place-items-center rounded-full bg-forest-soft text-forest">
              <Icon name="shieldCheck" className="size-4.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold">Everyone verified</span>
              <span className="block text-[0.6875rem] text-muted">Photo + selfie check</span>
            </span>
          </div>
        </div>

        <div className="layer float absolute bottom-[7%] left-[-2%]" style={{ ["--z" as string]: "150px", ["--t" as string]: "5.5s", ["--d" as string]: "-3s" }}>
          <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-2.5 shadow-xl">
            <span className="grid size-9 place-items-center rounded-full text-sm font-bold text-night" style={{ background: "#e9a07a" }}>
              R
            </span>
            <span className="leading-tight">
              <span className="flex items-center gap-1 text-xs font-bold">
                Riya, 26 <Icon name="shieldCheck" className="size-3.5 text-forest" />
              </span>
              <span className="block text-[0.6875rem] font-semibold text-forest">Both like Coffee, Slow travel</span>
            </span>
          </div>
        </div>

        <div className="layer float absolute bottom-[3%] right-[6%]" style={{ ["--z" as string]: "100px", ["--t" as string]: "6s", ["--d" as string]: "-4s" }}>
          <div className="flex items-center gap-2.5 rounded-2xl bg-band px-3.5 py-2.5 text-white shadow-xl">
            <span className="grid size-7 place-items-center rounded-full bg-white/20">
              <Icon name="check" className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold">Request accepted</span>
              <span className="block text-[0.6875rem] text-white/80">Chat is now open</span>
            </span>
          </div>
        </div>

        <div className="layer float absolute left-[0%] top-[8%]" style={{ ["--z" as string]: "90px", ["--t" as string]: "4.5s", ["--d" as string]: "-2.5s" }}>
          <span className="grid size-12 place-items-center rounded-2xl bg-marigold text-night shadow-xl rotate-[-8deg]">
            <Icon name="compass" className="size-6" />
          </span>
        </div>
      </div>
    </div>
  );
}
