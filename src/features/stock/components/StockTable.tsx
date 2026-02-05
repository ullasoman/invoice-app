import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { StockRow } from "../types";
import StockBadge from "./StockBadge";

export default function StockTable({
  stocks,
  loading,
  onAdjust,
  mode,
}: {
  stocks: StockRow[];
  loading: boolean;
  onAdjust: (row: StockRow) => void;
  mode: "warehouse" | "sales";
}) {
  if (loading)
    return (
      <div className="p-6 text-center text-muted-foreground">Loading...</div>
    );

  if (!stocks.length)
    return (
      <div className="p-6 text-center text-muted-foreground">
        No {mode === "sales" ? "sales movements" : "stock data"} found.
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>

          {/* Always show shop column when warehouse has shop-wise view */}
          <TableHead>
            {mode === "warehouse" ? "Shop / Location" : "Customer / Shop"}
          </TableHead>

          <TableHead>Current Stock</TableHead>
          <TableHead>Min Level</TableHead>
          <TableHead>Status</TableHead>

          {mode === "sales" && (
            <>
              <TableHead>Total Sold</TableHead>
              <TableHead>Last Sold</TableHead>
            </>
          )}

          {mode === "warehouse" && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {stocks.map((stock) => {
          const minLevel =
            stock.product?.minStockLevel ?? stock.product?.min_stock_level ?? 0;

          return (
            <TableRow key={`${stock.product?.id}-${stock.shopId}`}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">
                    {stock.product?.name ?? "Unknown Product"}
                  </span>
                </div>
              </TableCell>

              <TableCell>{stock.product?.sku ?? "N/A"}</TableCell>
              <TableCell>{stock.shop?.name ?? "—"}</TableCell>
              <TableCell>
                {stock.currentStock} {stock.product?.unit ?? ""}
              </TableCell>
              <TableCell>{minLevel}</TableCell>
              <TableCell>
                <StockBadge stock={stock} />
              </TableCell>

              {mode === "sales" && (
                <>
                  <TableCell>{stock.sales?.totalSold ?? "-"}</TableCell>
                  <TableCell>
                    {stock.sales?.lastSoldAt
                      ? new Date(stock.sales.lastSoldAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </>
              )}

              {mode === "warehouse" && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAdjust(stock)}
                  >
                    Adjust
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
