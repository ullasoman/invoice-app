import {
  TrendingUp,
  BarChart3,
  Plus,
  Users,
  TrendingUpIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { de } from "zod/v4/locales";

interface MonthlySummaryProps {
  sales: number;
  purchases: number;
  netProfit: number;
}

export default function MonthlySummary({
  sales,
  purchases,
  netProfit,
}: MonthlySummaryProps) {
  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Monthly Summary Section */}
      <Card className="p-4 bg-white border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Monthly Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Sales */}
          <div className="p-4 rounded-xl bg-emerald-50">
            <p className="text-sm font-medium text-emerald-700 mb-2">
              Monthly Sales
            </p>
            <p className="text-3xl font-bold text-emerald-600">
              {" "}
              {formatCurrency(sales)}
            </p>
          </div>

          {/* Monthly Purchases */}
          <div className="p-4 rounded-xl bg-purple-50">
            <p className="text-sm font-medium text-purple-700 mb-2">
              Monthly Purchases
            </p>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(purchases)}
            </p>
          </div>

          {/* Net Profit */}
          <div className="p-4 rounded-xl bg-blue-50">
            <p className="text-sm font-medium text-blue-700 mb-2">Net Profit</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(netProfit)}
            </p>
          </div>
        </div>
      </Card>

      
    </div>
  );
}
