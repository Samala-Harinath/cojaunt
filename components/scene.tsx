import { useId } from "react";
import type { Scene as SceneName } from "@/lib/plan-types";

type Art = {
  sky: [string, string];
  sun: string;
  sunAt: [number, number];
  fills: [string, string, string];
  layers: [string, string, string];
  extra?: string;
};

/** Hand-drawn cover art, one per kind of plan. No stock photography ships with the prototype. */
const art: Record<SceneName, Art> = {
  hills: {
    sky: ["#fde9c6", "#f4b78a"], sun: "#fff7e2", sunAt: [300, 72], fills: ["#93b89d", "#4f8a6c", "#1f4d3f"],
    layers: ["M0 150C60 110 110 120 170 140S290 100 400 130V240H0Z", "M0 180C70 150 130 170 200 165S330 140 400 170V240H0Z", "M0 205C80 185 150 215 230 200S350 190 400 205V240H0Z"],
  },
  coast: {
    sky: ["#ffdcb4", "#ee8d6a"], sun: "#fff3d4", sunAt: [150, 132], fills: ["#b9694f", "#3d8c9b", "#f0c896"],
    layers: ["M250 150C290 110 350 105 400 120V165H250Z", "M0 150H400V240H0Z", "M0 208C90 188 190 226 400 196V240H0Z"],
  },
  peaks: {
    sky: ["#dbe7f5", "#f6cdac"], sun: "#ffffff", sunAt: [110, 78], fills: ["#aab9c9", "#6d8296", "#2f4558"],
    layers: ["M0 170L70 90L120 140L190 60L260 150L320 100L400 160V240H0Z", "M0 195L90 130L150 175L230 120L310 180L400 150V240H0Z", "M0 215L110 180L200 210L300 185L400 215V240H0Z"],
  },
  forest: {
    sky: ["#e6f2da", "#b7d8ae"], sun: "#fcffec", sunAt: [310, 62], fills: ["#8cc08f", "#3f8a5c", "#17503a"],
    layers: ["M0 140C50 120 90 150 140 130S240 110 290 135S360 115 400 130V240H0Z", "M0 175C60 155 120 185 190 165S320 150 400 178V240H0Z", "M0 210C100 190 180 220 260 205S360 200 400 212V240H0Z"],
    extra: "M60 180l14-42 14 42z M300 172l16-48 16 48z M335 178l12-36 12 36z",
  },
  city: {
    sky: ["#35295a", "#b25578"], sun: "#ffdcae", sunAt: [300, 58], fills: ["#5c417c", "#3a2a5a", "#221a3d"],
    layers: ["M0 150h30v-30h35v20h30v-50h30v40h40v-25h35v35h40v-55h30v45h45v-20h40v20h45V240H0Z", "M0 185h45v-25h50v15h45v-35h40v30h60v-20h50v25h55v-15h55V240H0Z", "M0 215H400V240H0Z"],
  },
  craft: {
    sky: ["#f8e6d4", "#e8b796"], sun: "#fff5e6", sunAt: [90, 70], fills: ["#dba27f", "#b0603f", "#6f3a28"],
    layers: ["M0 160C100 140 300 140 400 160V240H0Z", "M110 200c-22-18-22-52 0-66h30c22 14 22 48 0 66z M220 200c-30-24-26-72-6-84h52c20 12 24 60-6 84z M318 200c-16-14-16-40 0-52h24c16 12 16 38 0 52z", "M0 198H400V240H0Z"],
  },
};

export function Scene({ name, className = "" }: { name: SceneName; className?: string }) {
  const { sky, sun, sunAt, fills, layers, extra } = art[name];
  // The same scene can appear several times on a page, so the gradient id must be unique per instance.
  const id = `sky-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className={`block ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <circle cx={sunAt[0]} cy={sunAt[1]} r="46" fill={sun} opacity="0.35" />
      <circle cx={sunAt[0]} cy={sunAt[1]} r="26" fill={sun} />
      {layers.map((d, i) => (
        <path key={d} d={d} fill={fills[i]} />
      ))}
      {extra ? <path d={extra} fill={fills[2]} /> : null}
    </svg>
  );
}
