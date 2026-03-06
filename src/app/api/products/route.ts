import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/auth';
import { makeId } from '@/lib/auth/auth';
import { readDb, updateDb } from '@/lib/store/db';
import { Product } from '@/lib/types';

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const db = await readDb();
  return NextResponse.json(db.products);
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const now = new Date().toISOString();

  const product: Product = {
    id: body.id || makeId(),
    productCode: body.productCode || '',
    productName: body.productName,
    requiredParts: (body.requiredParts ?? []).map((p: any) => ({
      id: p.id || makeId(),
      partCode: p.partCode,
      partName: p.partName,
      quantityPerProduct: Number(p.quantityPerProduct),
    })),
    createdAt: body.createdAt || now,
    updatedAt: now,
  };

  await updateDb((db) => {
    const idx = db.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) db.products[idx] = product;
    else db.products.push(product);
  });

  return NextResponse.json(product);
}

export async function DELETE(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await updateDb((db) => {
    db.products = db.products.filter((p) => p.id !== id);
  });
  return NextResponse.json({ ok: true });
}
