import NextAuth from "next-auth";
import { auth } from "./auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";
const { auth: middleware } = NextAuth(authConfig);

export default middleware(async (req) => {
  const session = await auth();
  const nextUrl = req.nextUrl;

  if (session?.user && nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (
    nextUrl.pathname.startsWith("/dashboard") &&
    session?.user?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session && nextUrl.pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
