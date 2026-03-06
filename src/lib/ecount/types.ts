export interface EcountLoginResponse {
  Status: string;
  Data?: {
    SessionId?: string;
    Zone?: string;
  };
  Error?: { Message?: string };
}

export interface EcountInventoryResponse {
  Status: string;
  Data?: Array<Record<string, unknown>>;
  Error?: { Message?: string };
}

export interface EcountQuotationResponse {
  Status: string;
  Data?: Record<string, unknown>;
  Error?: { Message?: string };
}
