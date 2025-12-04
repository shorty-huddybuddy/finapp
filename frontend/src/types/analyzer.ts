export interface ResultItem {
  investment_option?: string;
  allocation?: string;
  liquidity?: string;
  risk?: string;
  // Legacy format support
  "Investment Option"?: string;
  Allocation?: number | string;
  Liquidity?: string;
  Risk?: string;
}
