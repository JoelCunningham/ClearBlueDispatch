import { auth } from "@/auth";

export default auth(request => {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/routes") ||
    request.nextUrl.pathname.startsWith("/manage") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/dockets") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/customers") ||
    request.nextUrl.pathname.startsWith("/users");

  if (isProtectedRoute && !request.auth) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);

    return Response.redirect(loginUrl);
  }
});
