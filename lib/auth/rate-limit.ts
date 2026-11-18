/**
 * A small in-memory limiter for the auth endpoints. It protects a single server process only:
 * on serverless or several instances each one counts separately. The backend must rate-limit
 * sign-in, sign-up and code requests per account and per IP at the edge as well.
 */
type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

/** True when this call is allowed. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [name, bucket] of buckets) if (bucket.reset <= now) buckets.delete(name);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
