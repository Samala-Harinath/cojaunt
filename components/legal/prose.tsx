import Link from "next/link";
import type { ReactNode } from "react";
import { legal } from "@/lib/config";

/** A legal page: title, date, the draft notice, then sections. */
export function Doc({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <article className="pb-10 pt-8 md:pt-12">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">
        Last updated {legal.updated} · Version {legal.version}
      </p>
      {legal.reviewed ? null : (
        <p role="note" className="mt-5 rounded-2xl bg-marigold-soft px-4 py-3 text-sm leading-relaxed text-amber-ink">
          <strong>Draft pending legal review.</strong> This page explains how {legal.company} is designed to work. It has not yet been reviewed by a lawyer and isn’t final.
        </p>
      )}
      {intro ? <div className="mt-6 text-base leading-relaxed">{intro}</div> : null}
      <div className="mt-8 space-y-9">{children}</div>
    </article>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl leading-snug md:text-3xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed">{children}</div>
    </section>
  );
}

export function SubHead({ children }: { children: ReactNode }) {
  return <h3 className="pt-1 text-base font-bold">{children}</h3>;
}

export const P = ({ children }: { children: ReactNode }) => <p>{children}</p>;

export function List({ items, ordered = false }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`space-y-2 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-muted`}>
      {items.map((item, i) => (
        <li key={i} className="pl-1">
          {item}
        </li>
      ))}
    </Tag>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead className="bg-surface">
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col" className="border-b border-line px-4 py-2.5 font-bold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 ${i < rows.length - 1 ? "border-b border-line" : ""} ${j === 0 ? "font-semibold" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-forest-soft px-4 py-3.5 text-sm leading-relaxed text-forest-deep">{children}</p>;
}

export const A = ({ href, children }: { href: string; children: ReactNode }) =>
  href.startsWith("mailto:") || href.startsWith("tel:") ? (
    <a href={href} className="font-semibold text-forest underline underline-offset-4">
      {children}
    </a>
  ) : (
    <Link href={href} className="font-semibold text-forest underline underline-offset-4">
      {children}
    </Link>
  );
