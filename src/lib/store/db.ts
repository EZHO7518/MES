import { promises as fs } from 'fs';
import path from 'path';
import { AppUser, Product, Quotation } from '@/lib/types';

interface DbShape {
  users: AppUser[];
  products: Product[];
  quotations: Quotation[];
  sessions: Record<string, string>;
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'db.json');

const initialDb: DbShape = { users: [], products: [], quotations: [], sessions: {} };

async function ensureDb() {
  await fs.mkdir(DB_DIR, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

export async function readDb(): Promise<DbShape> {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as DbShape;
}

export async function writeDb(next: DbShape) {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), 'utf-8');
}

export async function updateDb(mutator: (db: DbShape) => void | DbShape) {
  const db = await readDb();
  const result = mutator(db);
  await writeDb(result ?? db);
}
