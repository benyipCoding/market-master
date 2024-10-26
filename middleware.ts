import { NextRequest } from "next/server";

const unauthorizedRoutes = [
  "/home",
  "/favicon.ico",
  "/auth/login",
  "/playground",
  "/test",
];
export function middleware(request: NextRequest) {
  const auth = request.cookies.get("Authentication")?.value;

  if (request.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/home", request.url));
  }

  if (
    !auth &&
    !unauthorizedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
    console.log("未经身份认证，不能访问受保护网页");
    return Response.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
