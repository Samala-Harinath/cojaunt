export default function Loading() {
  return (
    <div className="px-5 pt-6" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-2/3 animate-pulse rounded-xl bg-line" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-line" />
        <div className="h-64 animate-pulse rounded-3xl bg-line" />
      </div>
    </div>
  );
}
