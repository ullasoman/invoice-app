export interface Shop {
  id: number | string;
  name: string;
}

export interface Product {
  id: number | string;
  name: string;
  sku?: string | null;
  description?: string | null;
  unit?: string | null;
  minStockLevel?: number | null;
  min_stock_level?: number | null;
}
export interface StockRowAPI {
  id?: number | string;
  product_id?: number | string;
  shop_id?: number | string;
  current_stock?: number;
  currentStock?: number;
  product?: Product | null;
  shop?: Shop | null;
  sales?: {
    totalSold: number;
    lastSoldAt: string | null;
  };
}

export interface StockRow {
  id: string;
  productId: string;
  shopId: string;
  currentStock: number;
  product?: Product | null;
  shop?: Shop | null;
  sales?: {
    totalSold: number;
    lastSoldAt: string | null;
  };
}
