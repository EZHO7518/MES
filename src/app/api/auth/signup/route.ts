import { NextResponse } from 'next/server';
import { createSession, hashPassword, makeId, sessionCookieName } from '@/lib/auth/auth';
import { readDb, updateDb } from '@/lib/store/db';

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body.username ?? '').trim();
  const password = String(body.password ?? '');

  if (!username || !password) return NextResponse.json({ error: 'username and password are required' }, { status: 400 });

  const db = await readDb();
  if (db.users.some((u) => u.username === username)) {
    return NextResponse.json({ error: 'username already exists' }, { status: 409 });
  }

  const user = { id: makeId(), username, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
  await updateDb((draft) => {
    draft.users.push(user);
  });

  const token = await createSession(user.id);
  const response = NextResponse.json({ ok: true, username: user.username });
  response.cookies.set(sessionCookieName, token, { httpOnly: true, sameSite: 'lax', path: '/' });
  return response;
}
