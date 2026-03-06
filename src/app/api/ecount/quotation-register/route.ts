import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/auth';
import { readDb } from '@/lib/store/db';
import { registerQuotationToEcount } from '@/lib/ecount/quotation';

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const quotationId = String(body.quotationId ?? '');

  const db = await readDb();
  const quotation = db.quotations.find((q) => q.id === quotationId);
  if (!quotation) return NextResponse.json({ error: 'quotation not found' }, { status: 404 });

  const items = quotation.items.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    return { productCode: product?.productCode || item.productName, quantity: item.quantity };
  });

  try {
    const result = await registerQuotationToEcount({
      customerName: quotation.customerName,
      note: quotation.note,
      items,
    });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
