import { fetchInventoryByPartCodes } from '@/lib/ecount/inventory';
import { InventoryCheckResult, Product, Quotation } from '@/lib/types';

export async function runInventoryCheck(quotation: Quotation, products: Product[]): Promise<InventoryCheckResult> {
  const requirementMap = new Map<string, { partName: string; requiredQty: number }>();

  for (const item of quotation.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;

    for (const part of product.requiredParts) {
      const prev = requirementMap.get(part.partCode);
      const addQty = part.quantityPerProduct * item.quantity;
      requirementMap.set(part.partCode, {
        partName: part.partName,
        requiredQty: (prev?.requiredQty ?? 0) + addQty,
      });
    }
  }

  const partCodes = [...requirementMap.keys()];
  const stockRows = partCodes.length ? await fetchInventoryByPartCodes(partCodes) : [];
  const stockMap = new Map(stockRows.map((row) => [row.partCode, row]));

  const detailRows = partCodes.map((partCode) => {
    const req = requirementMap.get(partCode)!;
    const stock = stockMap.get(partCode);
    const stockQty = stock?.stockQty ?? 0;
    const shortageQty = Math.max(0, req.requiredQty - stockQty);
    return {
      partCode,
      partName: req.partName,
      requiredQty: req.requiredQty,
      stockQty,
      shortageQty,
      status: !stock ? 'missing' : shortageQty > 0 ? 'insufficient' : 'ok',
    };
  });

  const shortageList = detailRows.filter((row) => row.shortageQty > 0 || row.status === 'missing');
  const shortageAmountByPart = Object.fromEntries(shortageList.map((s) => [s.partCode, s.shortageQty]));
  const producible = shortageList.length === 0;
  const summaryStatus = producible
    ? 'producible'
    : shortageList.length === detailRows.length
      ? 'not producible'
      : 'partially insufficient';

  return {
    producible,
    summaryStatus,
    requiredParts: detailRows.map((r) => ({ partCode: r.partCode, partName: r.partName, requiredQty: r.requiredQty })),
    currentStock: detailRows.map((r) => ({
      partCode: r.partCode,
      partName: r.partName,
      stockQty: r.stockQty,
      found: r.status !== 'missing',
    })),
    shortageList,
    shortageAmountByPart,
    detailRows,
  };
}
