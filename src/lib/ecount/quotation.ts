import { ecountConfig } from '@/lib/ecount/config';
import { ecountLogin } from '@/lib/ecount/auth';
import { ecountPost } from '@/lib/ecount/client';
import { buildQuotationPayload } from '@/lib/ecount/mappers';
import { EcountQuotationResponse } from '@/lib/ecount/types';

export async function registerQuotationToEcount(input: {
  customerName: string;
  note?: string;
  items: Array<{ productCode: string; quantity: number }>;
}) {
  if (!ecountConfig.enableQuotationWrite) {
    throw new Error('ECOUNT quotation registration is disabled by ECOUNT_ENABLE_QUOTATION_WRITE=false');
  }

  const { sessionId } = await ecountLogin();
  const payload = buildQuotationPayload({ sessionId, ...input });

  // TODO: Verify exact quotation write endpoint for your ECOUNT tenant/version.
  const response = await ecountPost<EcountQuotationResponse>('/OAPI/V2/Quotation/Save', payload);
  if (response.Status !== '200') {
    throw new Error(response.Error?.Message ?? 'Quotation registration API failure');
  }
  return response;
}
