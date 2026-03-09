export interface AppUser {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface RequiredPart {
  id: string;
  partCode: string;
  partName: string;
  quantityPerProduct: number;
}

export interface Product {
  id: string;
  productCode?: string;
  productName: string;
  requiredParts: RequiredPart[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface Quotation {
  id: string;
  customerName: string;
  note?: string;
  items: QuotationItem[];
  createdBy: string;
  createdAt: string;
}

export interface InventoryBalanceItem {
  partCode: string;
  partName: string;
  stockQty: number;
  warehouseName?: string;
  found: boolean;
}

export interface InventoryCheckRequest {
  quotationId: string;
}

export interface PartRequirementRow {
  partCode: string;
  partName: string;
  requiredQty: number;
  stockQty: number;
  shortageQty: number;
  status: 'ok' | 'insufficient' | 'missing';
}

export interface InventoryCheckResult {
  producible: boolean;
  summaryStatus: 'producible' | 'partially insufficient' | 'not producible';
  requiredParts: Array<{ partCode: string; partName: string; requiredQty: number }>;
  currentStock: InventoryBalanceItem[];
  shortageList: PartRequirementRow[];
  shortageAmountByPart: Record<string, number>;
  detailRows: PartRequirementRow[];
}
