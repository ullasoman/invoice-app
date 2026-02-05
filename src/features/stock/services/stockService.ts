import api from "@/shared/api/api";
import { StockRowAPI, StockRow, Shop } from "../types";
import { extractData } from "@/shared/api/extractData";

/**
 * Fetch customers (buyers/shops) for dropdowns or filters
 */
export async function fetchCustomers(): Promise<Shop[]> {
  const res = await api.get("/stock-levels/customers");
  return extractData(res);
}

/**
 * Fetch stock levels for warehouse or sales modes
 * @param mode "warehouse" | "sales"
 * @param level "all" | "low" | "out"
 */
export async function fetchStockLevels(
  mode: "warehouse" | "sales" = "warehouse",
  level: "all" | "low" | "out" = "all"
): Promise<StockRow[]> {
  // Backend route: /stock-levels/list/{level?}?mode=warehouse
  const url =
    level === "all"
      ? `/stock-levels/list?mode=${mode}`
      : `/stock-levels/list/${level}?mode=${mode}`;

  const res = await api.get(url);
  const raw: StockRowAPI[] = extractData(res);

  return raw.map((row) => ({
    id: String(row.id ?? `${row.product_id}-${row.shop_id}`),
    productId: String(row.product?.id ?? row.product_id ?? ""),
    shopId: String(row.shop?.id ?? row.shop_id ?? ""),
    currentStock: Number(row.currentStock ?? row.current_stock ?? 0),
    product: row.product ?? null,
    shop: row.shop ?? null,
    sales: row.sales ?? { totalSold: 0, lastSoldAt: null },
  }));
}

/**
 * Adjust stock manually (warehouse adjustments)
 */
export async function adjustStock(payload: {
  productId: string;
  shopId?: string;
  quantity: number;
  reason: string;
}) {
  // Correct backend endpoint: /stock-levels/adjust
  const body = {
    productId: Number(payload.productId),
    shopId: payload.shopId ? Number(payload.shopId) : null,
    quantity: payload.quantity,
    reason: payload.reason,
  };

  const res = await api.post("/stock-levels/adjust", body);
  return extractData(res);
}
