import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const url = request.nextUrl.clone();

  // Check if the user has visited before using cookies
  const hasVisited = request.cookies.get("hasVisitedBefore")?.value;
  const isHomePage = url.pathname === "/" || url.pathname === "";
  const skipRedirect = url.searchParams.has("skipRedirect");

  // Redirect logic for returning users
  if (isHomePage && hasVisited === "true" && !skipRedirect) {
    url.pathname = "/stores";
    // Preserve any existing query parameters
    if (request.nextUrl.searchParams.toString()) {
      url.search = request.nextUrl.searchParams.toString();
    }
    return NextResponse.redirect(url);
  }

  // If the user is visiting for the first time, set the cookie
  if (isHomePage && !hasVisited) {
    const response = NextResponse.next();
    response.cookies.set("hasVisitedBefore", "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // Authentication check for protected routes
  const token = await getToken({ req: request });
  const isAuth = !!token;

  // Protected routes
  const protectedRoutes = ["/checkout", "/dashboard", "/setup"];
  const isAccessingProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isAccessingProtectedRoute && !isAuth) {
    url.pathname = "/signin";
    // Save the original URL as a callback parameter
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/checkout/:path*", "/dashboard/:path*", "/setup"],
};
