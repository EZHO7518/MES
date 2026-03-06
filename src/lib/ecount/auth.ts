import { ecountConfig, assertEcountConfigured } from '@/lib/ecount/config';
import { ecountPost } from '@/lib/ecount/client';
import { EcountLoginResponse } from '@/lib/ecount/types';

export async function getZoneIfNeeded() {
  if (ecountConfig.zone) return ecountConfig.zone;
  // TODO: Adjust this zone discovery endpoint/path if your ECOUNT tenant requires different URL.
  const result = await ecountPost<{ Data?: { Zone?: string } }>('/OAPI/V2/Zone', {
    COM_CODE: ecountConfig.comCode,
  });
  return result.Data?.Zone ?? '';
}

export async function ecountLogin() {
  assertEcountConfigured();
  const zone = await getZoneIfNeeded();
  if (!zone) {
    throw new Error('Unable to resolve ECOUNT zone. Set ECOUNT_ZONE or verify zone discovery endpoint.');
  }

  // TODO: Confirm exact login payload fields for your ECOUNT account policy.
  const payload = {
    COM_CODE: ecountConfig.comCode,
    USER_ID: ecountConfig.userId,
    API_CERT_KEY: ecountConfig.apiCertKey,
    LAN_TYPE: ecountConfig.lanType,
    ZONE: zone,
  };

  const response = await ecountPost<EcountLoginResponse>(`/OAPI/V2/OAPILogin`, payload);
  if (response.Status !== '200' || !response.Data?.SessionId) {
    throw new Error(response.Error?.Message ?? 'ECOUNT login failure. Check credentials and zone.');
  }

  return { sessionId: response.Data.SessionId, zone };
}
