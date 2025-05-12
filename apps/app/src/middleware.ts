import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PAGES = ["/login", "/refresh"];

const PUBLIC_ASSETS = [
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".ico",
  ".webp",
  ".gif",
];

export const config = {
  matcher: [
    /*
     * Match all request paths except those starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (website icon)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const cookieAuthToken = req.cookies.get("privy-token");
  const cookieSession = req.cookies.get("privy-session");
  const { pathname } = req.nextUrl;

  if (PUBLIC_PAGES.includes(pathname) || pathname.startsWith("/events/")) {
    return NextResponse.next();
  }

  if (PUBLIC_ASSETS.some((ext) => pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  if (
    req.nextUrl.searchParams.has("privy_oauth_code") ||
    req.nextUrl.searchParams.has("privy_oauth_state") ||
    req.nextUrl.searchParams.has("privy_oauth_provider")
  ) {
    return NextResponse.next();
  }
  const definitelyAuthenticated = Boolean(cookieAuthToken);
  const maybeAuthenticated = Boolean(cookieSession);

  if (!definitelyAuthenticated && maybeAuthenticated) {
    const redirectUrl = new URL("/refresh", req.url);
    redirectUrl.searchParams.set("redirect_uri", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (!definitelyAuthenticated && !maybeAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_uri", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
