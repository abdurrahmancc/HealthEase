import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); 
  const tokenCookie = cookieStore.get("accessToken");

  if (!tokenCookie) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  const token = tokenCookie.value;

  return NextResponse.json({ token });
}
