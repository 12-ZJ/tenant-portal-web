"use server"

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    cookieStore.set("accessToken", "", { expires: new Date(0) });
    return true;
  }
  return false;
}

export async function getSession() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;
  return jwtDecode(token);
}

export async function getDecodeSession(token: string) {
  return jwtDecode(token);
}

export async function getAccessToken() {
  const token = (await cookies()).get("accessToken")?.value;
  return token;
}

export async function getAuthToken() {
  const token = (await cookies()).get("accessToken")?.value;
  return token;
}