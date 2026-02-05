"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

import {
  fetchCustomers,
  fetchStockLevels,
  adjustStock,
} from "@/features/stock/services/stockService";
import { StockRow, Shop } from "@/features/stock/types";
import StockTable from "@/features/stock/components/StockTable";
import StockAdjustDialog from "@/features/stock/components/StockAdjustDialog";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function StockLevelPage() {
  const { toast } = useToast();

  // ------------------ State ------------------
  const [mode, setMode] = useState<"warehouse" | "sales">("warehouse");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [stocks, setStocks] = useState<StockRow[]>([]);

  const [selectedStock, setSelectedStock] = useState<StockRow | null>(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  // ------------------ Data Load ------------------
  const loadData = async () => {
    try {
      setLoading(true);

      const requests: Promise<any>[] = [];
      if (mode === "warehouse") requests.push(fetchCustomers());
      requests.push(fetchStockLevels(mode, stockFilter));

      const results = await Promise.all(requests);

      if (mode === "warehouse") {
        const [shopsRes, stockRes] = results;
        setShops(shopsRes);
        setStocks(stockRes);
      } else {
        const [stockRes] = results;
        setStocks(stockRes);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load stock data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [mode, stockFilter]);

  // ------------------ Filters ------------------
  const filteredStocks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return stocks.filter((s) => {
      const product = s.product;
      const shop = s.shop;
      const minLevel = product?.minStockLevel ?? product?.min_stock_level ?? 0;

      const status =
        s.currentStock <= 0 ? "out" : s.currentStock <= minLevel ? "low" : "in";

      const matchStatus = stockFilter === "all" ? true : stockFilter === status;
      const matchShop =
        shopFilter === "all" ? true : String(s.shopId) === shopFilter;
      const matchSearch =
        !q ||
        product?.name?.toLowerCase().includes(q) ||
        product?.sku?.toLowerCase().includes(q) ||
        shop?.name?.toLowerCase().includes(q);

      return matchStatus && matchShop && matchSearch;
    });
  }, [stocks, stockFilter, shopFilter, searchTerm]);

  // ------------------ Stock Adjustment ------------------
  const handleAdjust = (row: StockRow) => {
    setSelectedStock(row);
    setAdjustDialogOpen(true);
  };

  const handleSaveAdjustment = async (
    productId: string,
    shopId: string,
    quantity: number,
    reason: string
  ) => {
    try {
      await adjustStock({ productId, shopId, quantity, reason });
      toast({ title: "Stock updated", description: "Adjustment saved" });
      setAdjustDialogOpen(false);
      setSelectedStock(null);
      loadData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive",
      });
    }
  };

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Sales Management", href: "/sales/invoices" },
          { label: "Stock Levels" },
        ]}
      />

      {/* Header */}
      <div className="container flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold">
          {mode === "warehouse" ? "Warehouse Stock" : "Sales Movement"}
        </h1>
        <div className="flex gap-2">
          <Button
            variant={mode === "warehouse" ? "default" : "outline"}
            onClick={() => setMode("warehouse")}
          >
            Warehouse
          </Button>
          <Button
            variant={mode === "sales" ? "default" : "outline"}
            onClick={() => setMode("sales")}
          >
            Sales Movement
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="container flex flex-wrap items-center gap-3 justify-between">
        {/* Stock Filter */}
        <Select
          value={stockFilter}
          onValueChange={(value) =>
            setStockFilter(value as "all" | "low" | "out")
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stock filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        {/* Shop Filter (only warehouse mode) */}
        {mode === "warehouse" && (
          <Select value={shopFilter} onValueChange={setShopFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Shop filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shops</SelectItem>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={String(shop.id)}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by product or shop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="container mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "warehouse"
                ? "Warehouse Stock Overview"
                : "Sales & Stock Movements"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockTable
              stocks={filteredStocks}
              loading={loading}
              onAdjust={handleAdjust}
              mode={mode}
            />
          </CardContent>
        </Card>
      </div>

      {/* Stock Adjust Dialog */}
      {mode === "warehouse" && (
        <StockAdjustDialog
          open={adjustDialogOpen}
          onOpenChange={setAdjustDialogOpen}
          stock={selectedStock}
          onSave={handleSaveAdjustment}
        />
      )}
    </div>
  );
}
