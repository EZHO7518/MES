import { ecountConfig } from '@/lib/ecount/config';

export async function ecountPost<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${ecountConfig.baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`ECOUNT HTTP error ${res.status}`);
  }
  return (await res.json()) as T;
}
