import { Badge } from "@/components/ui/badge";
import { StockRow } from "../types";

export default function StockBadge({ stock }: { stock: StockRow }) {
  const minLevel =
    stock.product?.minStockLevel ?? stock.product?.min_stock_level ?? 0;

  if (stock.currentStock <= 0)
    return <Badge className="bg-red-100 text-red-700">Out of Stock</Badge>;
  if (stock.currentStock <= minLevel)
    return <Badge className="bg-amber-100 text-amber-700">Low Stock</Badge>;
  return <Badge className="bg-green-100 text-green-700">In Stock</Badge>;
}
