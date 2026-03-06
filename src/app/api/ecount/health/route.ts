import { NextResponse } from 'next/server';
import { ecountConfig } from '@/lib/ecount/config';

export async function GET() {
  const configured = Boolean(ecountConfig.comCode && ecountConfig.userId && ecountConfig.apiCertKey);
  return NextResponse.json({
    configured,
    quotationWriteEnabled: ecountConfig.enableQuotationWrite,
    baseUrl: ecountConfig.baseUrl,
    zoneConfigured: Boolean(ecountConfig.zone),
  });
}
