import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/auth';
import { makeId } from '@/lib/auth/auth';
import { readDb, updateDb } from '@/lib/store/db';
import { Quotation } from '@/lib/types';

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const db = await readDb();
  return NextResponse.json(db.quotations);
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();

  const quotation: Quotation = {
    id: makeId(),
    customerName: body.customerName,
    note: body.note,
    items: (body.items ?? []).map((i: any) => ({
      productId: i.productId,
      productName: i.productName,
      quantity: Number(i.quantity),
    })),
    createdBy: user.id,
    createdAt: new Date().toISOString(),
  };

  await updateDb((db) => {
    db.quotations.push(quotation);
  });

  return NextResponse.json(quotation);
}
