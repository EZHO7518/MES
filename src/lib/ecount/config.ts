export const ecountConfig = {
  comCode: process.env.ECOUNT_COM_CODE ?? '',
  userId: process.env.ECOUNT_USER_ID ?? '',
  apiCertKey: process.env.ECOUNT_API_CERT_KEY ?? '',
  lanType: process.env.ECOUNT_LAN_TYPE ?? 'ko-KR',
  zone: process.env.ECOUNT_ZONE ?? '',
  baseUrl: process.env.ECOUNT_BASE_URL ?? 'https://oapi.ecount.com',
  enableQuotationWrite: process.env.ECOUNT_ENABLE_QUOTATION_WRITE === 'true',
};

export function assertEcountConfigured() {
  const missing = ['ECOUNT_COM_CODE', 'ECOUNT_USER_ID', 'ECOUNT_API_CERT_KEY'].filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`ECOUNT not configured. Missing: ${missing.join(', ')}`);
  }
}
