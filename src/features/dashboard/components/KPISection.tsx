import { CreditCard, Truck, AlertTriangle, Building2 } from "lucide-react";
import KPICard from "./KPICard";

export default function KPISection({ kpis }: { kpis: any }) {
  const outstandingChangeType =
    kpis.outstandingChange === 0
      ? "neutral"
      : kpis.outstandingChange < 0
      ? "positive"
      : "negative";

  const deliveriesChangeType =
    kpis.deliveriesChange === 0
      ? "neutral"
      : kpis.deliveriesChange > 0
      ? "positive"
      : "negative";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Outstanding Revenue"
        value={`AED ${kpis.outstandingRevenue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`}
        change={`${kpis.outstandingChange > 0 ? "+" : ""}${
          kpis.outstandingChange
        }% vs last month`}
        changeType={outstandingChangeType}
        icon={<CreditCard className="w-6 h-6 text-primary" />}
        iconBg="bg-primary/10"
      />

      <KPICard
        title="Today's Sales"
        value={`${kpis.todayDeliveries}`}
        change={`${kpis.deliveriesChange > 0 ? "+" : ""}${
          kpis.deliveriesChange
        } from yesterday`}
        changeType={deliveriesChangeType}
        icon={<Truck className="w-6 h-6 text-green-600" />}
        iconBg="bg-green-100"
      />

      <KPICard
        title="Low Stock Alerts"
        value={`${kpis.lowStockAlerts}`}
        change={kpis.lowStockAlerts > 0 ? "Requires attention" : "All good"}
        changeType={kpis.lowStockAlerts > 0 ? "negative" : "neutral"}
        icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
        iconBg="bg-amber-100"
      />

      <KPICard
        title="Active Buyers"
        value={`${kpis.activeShops}`}
        change="All operational"
        changeType="neutral"
        icon={<Building2 className="w-6 h-6 text-blue-600" />}
        iconBg="bg-blue-100"
      />
    </div>
  );
}
