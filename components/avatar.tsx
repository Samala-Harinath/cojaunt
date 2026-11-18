import Image from "next/image";
import { isSafePhoto } from "@/lib/photos";

type AvatarProps = {
  name: string;
  hue: number;
  size?: number;
  /** Progressive trust: people stay blurred until the host approves you. */
  blurred?: boolean;
  className?: string;
  /** The member's own uploaded photo. Ignored unless it is a re-encoded JPEG (lib/photos.ts). */
  src?: string;
};

/** Generated avatar, or the member's own photo. The prototype ships no photographs of real people. */
export function Avatar({ name, hue, size = 40, blurred = false, className = "", src }: AvatarProps) {
  if (src && !blurred && isSafePhoto(src)) {
    return (
      <span className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }} aria-hidden="true">
        <Image src={src} alt="" fill unoptimized sizes={`${size}px`} className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        color: `hsl(${hue} 45% 24%)`,
        background: `linear-gradient(135deg, hsl(${hue} 75% 86%), hsl(${(hue + 40) % 360} 65% 72%))`,
      }}
      aria-hidden="true"
    >
      {blurred ? (
        <svg viewBox="0 0 40 40" className="size-full blur-[3px]">
          <circle cx="20" cy="15" r="7" fill="currentColor" opacity="0.45" />
          <path d="M6 40c0-9 6-14 14-14s14 5 14 14z" fill="currentColor" opacity="0.45" />
        </svg>
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}

type StackProps = { people: { id: string; name: string; hue: number }[]; blurred?: boolean; size?: number; max?: number };

export function AvatarStack({ people, blurred = false, size = 32, max = 5 }: StackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className="flex items-center">
      {shown.map((person, i) => (
        <span key={person.id} className={`rounded-full ring-2 ring-surface ${i > 0 ? "-ml-2" : ""}`}>
          <Avatar name={person.name} hue={person.hue} size={size} blurred={blurred} />
        </span>
      ))}
      {extra > 0 ? <span className="ml-2 text-xs font-semibold text-muted">+{extra}</span> : null}
    </span>
  );
}
