import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const token = body.token;
  const isProduction = process.env.NODE_ENV === "production";

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Token stored in cookie" });

  response.cookies.set("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}



