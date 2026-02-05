import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchDashboardSummary,
  fetchRecentInvoices,
} from "@/features/dashboard/services/dashboardService";

import DashboardHero from "@/features/dashboard/components/DashboardHero";
import KPISection from "@/features/dashboard/components/KPISection";
import QuickActions from "@/features/dashboard/components/QuickActions";
import SystemOverview from "@/features/dashboard/components/SystemOverview";
import RecentInvoices from "@/features/dashboard/components/RecentInvoices";
import MonthlySummary from "@/features/dashboard/components/MonthlySummary";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sales = summary?.revenue?.total_revenue || 0;
  const purchases = summary?.totals?.expenses || 0;
  const netProfit = sales - purchases;

  useEffect(() => {
    (async () => {
      try {
        const [summaryRes, invoicesRes] = await Promise.all([
          fetchDashboardSummary(),
          fetchRecentInvoices(5),
        ]);
        setSummary(summaryRes.data);
        setRecentInvoices(invoicesRes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !summary)
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* ===== Hero Section ===== */}
      <DashboardHero company={{ name: "Fatorah" }} />

      {/* ===== KPI Section ===== */}
      <KPISection
        kpis={{
          outstandingRevenue: summary.revenue.outstanding_revenue,
          outstandingChange: summary.revenue.outstanding_change,
          todayDeliveries: summary.sales.today_sales,
          deliveriesChange: summary.sales.sales_change,
          lowStockAlerts: summary.inventory.low_stock_alerts,
          activeShops: summary.inventory.active_buyers,
        }}
      />
      {/* --- Monthly Summary --- */}
      <MonthlySummary
        sales={sales}
        purchases={purchases}
        netProfit={netProfit}
      />

      {/* ===== Core Dashboard Sections ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SystemOverview
          invoices={Array(summary.totals.invoices).fill(null)}
          customers={Array(summary.totals.buyers).fill(null)}
          items={Array(summary.totals.items).fill(null)}
          expenses={Array(summary.totals.expenses ? 1 : 0).fill(null)}
        />
        <RecentInvoices recentInvoices={recentInvoices} />
      </div>
      {/* --- Quick Actions --- */}
      <QuickActions />
    </div>
  );
}
