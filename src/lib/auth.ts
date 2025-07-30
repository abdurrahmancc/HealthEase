import { jwtVerify } from "jose";

const secret = new TextEncoder().encode('cca93ff46e11b8542618d54d476a25b3cd4f2f2ce596ded1d0f0dc23c053d140');

export async function getUserFromToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error: unknown) {
    return null;
  }
}