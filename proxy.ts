import { auth } from "@/auth";

export default auth(request => {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/routes") || request.nextUrl.pathname.startsWith("/manage") || request.nextUrl.pathname.startsWith("/profile");

  if (isProtectedRoute && !request.auth) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);

    return Response.redirect(loginUrl);
  }
});
