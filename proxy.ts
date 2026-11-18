import { NextResponse, type NextRequest } from "next/server";
import { isAuthPage, isPublicPath, safeNext } from "@/lib/auth/rules";
import { SESSION_COOKIE, readSession } from "@/lib/auth/session-token";

/**
 * Route protection, deny by default: every page and API route needs a valid session cookie
 * unless it is listed as public in lib/auth/rules.ts. A signed-in member who opens the
 * sign-in pages or the landing page is sent into the app instead.
 *
 * This is the first gate. Server code that returns member data must still check the session itself.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (session && (isAuthPage(pathname) || pathname === "/")) {
    const target = isAuthPage(pathname) ? safeNext(request.nextUrl.searchParams.get("next")) : "/discover";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (isPublicPath(pathname) || session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return Response.json({ error: "Sign in to continue." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const login = new URL("/login", request.url);
  // Remember where they were going, but only for ordinary page loads.
  if (request.method === "GET") login.searchParams.set("next", safeNext(pathname + search));
  return NextResponse.redirect(login);
}

export const config = {
  // Skip build output and files with an extension (images, icons, manifest, robots, sitemap).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
