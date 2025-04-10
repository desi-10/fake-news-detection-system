import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth: middleware } = NextAuth(authConfig); // This is fine here

export default middleware((req) => {
  const { nextUrl } = req;

  if (
    nextUrl.pathname.startsWith("/dashboard") &&
    req.auth?.user?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// ✅ Do NOT set `runtime = "nodejs"` in middleware. It's always Edge.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
