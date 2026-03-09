import { NextResponse } from 'next/server';
import { ecountLogin } from '@/lib/ecount/auth';

export async function POST() {
  try {
    const data = await ecountLogin();
    return NextResponse.json({ ok: true, zone: data.zone });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
