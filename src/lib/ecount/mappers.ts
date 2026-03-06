import { InventoryBalanceItem } from '@/lib/types';

export function mapInventoryRow(raw: Record<string, unknown>): InventoryBalanceItem {
  // TODO: Adjust these field mappings to match your actual ECOUNT inventory response shape.
  return {
    partCode: String(raw.PROD_CD ?? raw.ITEM_CD ?? ''),
    partName: String(raw.PROD_DES ?? raw.ITEM_DES ?? ''),
    stockQty: Number(raw.BAL_QTY ?? raw.STOCK_QTY ?? 0),
    warehouseName: raw.WH_NAME ? String(raw.WH_NAME) : undefined,
    found: true,
  };
}

export function buildQuotationPayload(input: {
  sessionId: string;
  customerName: string;
  note?: string;
  items: Array<{ productCode: string; quantity: number }>;
}) {
  // TODO: Company-specific mapping: replace these sample fields with your real ECOUNT quotation input schema.
  return {
    SessionId: input.sessionId,
    Header: {
      CUST_DES: input.customerName,
      REMARKS: input.note ?? '',
    },
    Lines: input.items.map((item) => ({
      PROD_CD: item.productCode,
      QTY: item.quantity,
    })),
  };
}
