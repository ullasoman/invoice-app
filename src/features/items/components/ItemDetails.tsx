"use client";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  DollarSign,
  Tag,
  Calendar,
  Edit,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";

interface ItemDetailsProps {
  item: any;
  showBack?: boolean; // optional, so you can hide in modal
  onEdit?: () => void;
  onRestock?: () => void;
}

export default function ItemDetails({
  item,
  showBack = true,
  onEdit,
  onRestock,
}: ItemDetailsProps) {
  const navigate = useNavigate();
  const isLowStock = item.quantity <= item.alert_quantity;
  const profitMargin = (
    ((Number.parseFloat(item.selling_price) -
      Number.parseFloat(item.purchase_price)) /
      Number.parseFloat(item.purchase_price)) *
    100
  ).toFixed(1);

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground mt-1">SKU: {item.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/items/edit/${item.id}`)}
          >
            <Edit className="w-4 h-4" /> Edit Product
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/items`)}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Image & Info */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Stock Status
                </span>
                <Badge
                  variant={isLowStock ? "destructive" : "default"}
                  className="gap-1"
                >
                  {isLowStock ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <Package className="h-3 w-3" />
                  )}
                  {isLowStock ? "Low Stock" : "In Stock"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Category
                </span>
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {item.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Unit
                </span>
                <span className="font-medium">{item.unit}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">
                  {item.quantity}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Stock
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-orange-600">
                  {item.alert_quantity}
                </div>
                <div className="text-sm text-muted-foreground">Alert Level</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">
                  {Number.parseFloat(item.tax_rate).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Tax Rate</div>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Purchase Price</span>
                  <span className="font-semibold">
                    AED {Number.parseFloat(item.purchase_price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <span className="text-sm font-medium">Selling Price</span>
                  <span className="font-semibold text-green-700 dark:text-green-400">
                    AED {Number.parseFloat(item.selling_price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <span className="text-sm font-medium">Profit Margin</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-400">
                    {profitMargin}%
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Carton Rate</span>
                  <span className="font-semibold">
                    AED {Number.parseFloat(item.carton_rate).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Single Piece Rate</span>
                  <span className="font-semibold">
                    AED {Number.parseFloat(item.single_piece_rate).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          {item.description && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Product Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          )}

          {/* History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Product History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {new Date(item.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
