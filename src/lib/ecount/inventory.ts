import { ecountPost } from '@/lib/ecount/client';
import { ecountLogin } from '@/lib/ecount/auth';
import { EcountInventoryResponse } from '@/lib/ecount/types';
import { mapInventoryRow } from '@/lib/ecount/mappers';

export async function fetchInventoryByPartCodes(partCodes: string[]) {
  const { sessionId } = await ecountLogin();

  // TODO: Verify endpoint path and filter payload for your ECOUNT item/inventory API.
  const response = await ecountPost<EcountInventoryResponse>('/OAPI/V2/InventoryBalance/GetList', {
    SessionId: sessionId,
    PART_CODES: partCodes,
  });

  if (response.Status !== '200') {
    throw new Error(response.Error?.Message ?? 'Inventory API failure');
  }

  return (response.Data ?? []).map(mapInventoryRow);
}
