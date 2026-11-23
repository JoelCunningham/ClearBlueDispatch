import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { logServerEvent } from "@/lib/utils/logger";

export default auth(request => {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/routes") ||
    request.nextUrl.pathname.startsWith("/manage") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/dockets") ||
    request.nextUrl.pathname.startsWith("/deliveries") ||
    request.nextUrl.pathname.startsWith("/customers") ||
    request.nextUrl.pathname.startsWith("/users");

  if (isProtectedRoute && !request.auth) {
    const requestId = crypto.randomUUID();
    logServerEvent("warn", "auth.protected_route_denied", {
      requestId,
      method: request.method,
      path: request.nextUrl.pathname,
      reason: "no_session"
    });

    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);

    const response = NextResponse.redirect(loginUrl);
    response.headers.set("x-request-id", requestId);
    return response;
  }
});
