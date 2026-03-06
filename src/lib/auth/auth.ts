import crypto from 'crypto';
import { cookies } from 'next/headers';
import { readDb, updateDb } from '@/lib/store/db';

const SESSION_COOKIE = 'mes_session';

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function makeId() {
  return crypto.randomUUID();
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(24).toString('hex');
  await updateDb((db) => {
    db.sessions[token] = userId;
  });
  return token;
}

export async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await readDb();
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find((u) => u.id === userId) ?? null;
}

export async function destroySession(token?: string) {
  if (!token) return;
  await updateDb((db) => {
    delete db.sessions[token];
  });
}

export const sessionCookieName = SESSION_COOKIE;
