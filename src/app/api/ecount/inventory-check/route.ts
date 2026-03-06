import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/auth';
import { readDb } from '@/lib/store/db';
import { runInventoryCheck } from '@/lib/mes/check';

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const quotationId = String(body.quotationId ?? '');
  if (!quotationId) return NextResponse.json({ error: 'quotationId required' }, { status: 400 });

  const db = await readDb();
  const quotation = db.quotations.find((q) => q.id === quotationId);
  if (!quotation) return NextResponse.json({ error: 'quotation not found' }, { status: 404 });

  try {
    const result = await runInventoryCheck(quotation, db.products);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
        hint: 'If ECOUNT is not configured or endpoint mapping differs, update /src/lib/ecount/* files.',
      },
      { status: 400 },
    );
  }
}
