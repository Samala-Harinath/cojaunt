/** Fallback while a page reads its URL params. Matches the shape of a plan or chat screen. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-6" aria-busy="true" aria-label="Loading">
      <div className="aspect-[16/10] w-full animate-pulse rounded-3xl bg-line" />
      <div className="mt-5 h-9 w-2/3 animate-pulse rounded-xl bg-line" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded-lg bg-line" />
      <div className="mt-6 h-32 animate-pulse rounded-3xl bg-line" />
    </div>
  );
}
