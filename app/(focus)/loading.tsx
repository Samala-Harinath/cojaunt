export default function Loading() {
  return (
    <div className="px-5 pt-6" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-1/2 animate-pulse rounded-xl bg-line" />
      <div className="mt-6 h-40 animate-pulse rounded-3xl bg-line" />
      <div className="mt-4 h-40 animate-pulse rounded-3xl bg-line" />
    </div>
  );
}
