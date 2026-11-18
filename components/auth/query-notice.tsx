"use client";

import type { ReactNode } from "react";
import { Notice } from "./fields";
import { useQueryParam } from "./use-query";

/** Shows a one-off confirmation when the page is opened with ?param=1, for example after deleting an account. */
export function QueryNotice({ param, children }: { param: string; children: ReactNode }) {
  const value = useQueryParam(param);
  if (!value) return null;
  return (
    <div className="mt-6">
      <Notice tone="success">{children}</Notice>
    </div>
  );
}
