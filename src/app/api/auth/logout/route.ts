import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession, sessionCookieName } from '@/lib/auth/auth';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  await destroySession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, '', { path: '/', maxAge: 0 });
  return response;
}
