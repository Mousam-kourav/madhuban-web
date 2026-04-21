import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname.includes("hotel")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only apply to homepage
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    const trackingParams = ["sa", "ved", "fbclid", "gclid"];

    let hasTrackingParams = false;
    trackingParams.forEach((param) => {
      if (url.searchParams.has(param)) {
        hasTrackingParams = true;
        url.searchParams.delete(param);
      }
    });

    if (hasTrackingParams) {
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
