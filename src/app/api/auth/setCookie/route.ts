import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const token = body.token;

  if (!token) {
    return new Response(JSON.stringify({ error: "Token missing" }), {
      status: 400,
    });
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return new Response(JSON.stringify({ message: "Token stored in cookie" }), {
    status: 200,
  });
}



