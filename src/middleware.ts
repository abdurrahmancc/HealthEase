import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromToken } from "./lib/auth";
import { clerkMiddleware } from '@clerk/nextjs/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname, origin } = request.nextUrl;
  const path = pathname.toLowerCase();
  const user = await getUserFromToken(token);

  if (!token) {
    if (pathname === "/Login") {
      return NextResponse.redirect(new URL("/login", origin));
    }
    if (pathname === "/Register") {
      return NextResponse.redirect(new URL("/register", origin));
    }
    if (path === "/login" || path === "/register") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", origin));
  }



  if (!user && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", origin));
  }


  const role = (user?.UserRole as string)?.toLowerCase() || "";


  if (user && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL(`/${role}`, origin));
  }


  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(`/${role}`, origin));
  }

  if (pathname.startsWith("/patient") && role !== "patient") {
    return NextResponse.redirect(new URL(`/${role}`, origin));
  }

  if (pathname.startsWith("/doctor") && role !== "doctor") {
    return NextResponse.redirect(new URL(`/${role}`, origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*", "/login", "/register", "/Login", "/Register"],
};
