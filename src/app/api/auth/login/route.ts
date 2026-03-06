import { NextResponse } from 'next/server';
import { createSession, hashPassword, sessionCookieName } from '@/lib/auth/auth';
import { readDb } from '@/lib/store/db';

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body.username ?? '').trim();
  const password = String(body.password ?? '');

  const db = await readDb();
  const user = db.users.find((u) => u.username === username && u.passwordHash === hashPassword(password));
  if (!user) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });

  const token = await createSession(user.id);
  const response = NextResponse.json({ ok: true, username: user.username });
  response.cookies.set(sessionCookieName, token, { httpOnly: true, sameSite: 'lax', path: '/' });
  return response;
}
