"use client";

import { useRef, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./icon";

export type TabItem<T extends string> = { id: T; label: string; icon?: IconName; count?: number };

type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  /** Prefix for tab and panel ids, so a panel can point back with aria-labelledby. */
  idBase: string;
  className?: string;
};

export const tabId = (base: string, id: string) => `${base}-tab-${id}`;
export const panelId = (base: string) => `${base}-panel`;

/**
 * Primary tabs: a segmented control that scrolls sideways on narrow screens.
 * WAI-ARIA tabs pattern: one tab in the tab order, arrow keys / Home / End move and select.
 */
export function Tabs<T extends string>({ items, value, onChange, label, idBase, className = "" }: TabsProps<T>) {
  const list = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = items.findIndex((item) => item.id === value);
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = items[(keys[event.key] + items.length) % items.length];
    onChange(next.id);
    list.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(tabId(idBase, next.id))}`)?.focus();
  }

  return (
    <div ref={list} role="tablist" aria-label={label} className={`-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none] ${className}`}>
      <div className="flex shrink-0 gap-1 rounded-full border border-line bg-surface p-1">
        {items.map((item) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              id={tabId(idBase, item.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(idBase)}
              tabIndex={selected ? 0 : -1}
              onKeyDown={onKeyDown}
              onClick={() => onChange(item.id)}
              className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold text-muted transition-colors hover:text-ink aria-selected:bg-ink aria-selected:text-paper"
            >
              {item.icon ? <Icon name={item.icon} className="size-4" /> : null}
              {item.label}
              {item.count !== undefined ? (
                <span className="rounded-full bg-line px-1.5 text-xs tabular-nums text-ink [[aria-selected=true]_&]:bg-paper/20 [[aria-selected=true]_&]:text-paper">
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
