import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardHero from "@/assets/images/dashboard-hero.jpg";

export default function DashboardHero({ company }: { company?: any }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-header p-8 text-white">
      <div className="absolute inset-0 opacity-20">
        <img
          src={dashboardHero}
          alt="Dashboard"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to {company?.name || "UAE Invoice System"}
        </h1>
        <p className="text-lg opacity-90 mb-6">
          Manage your invoices, track sales, and stay VAT compliant
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link to="/sales/invoices/new">
              <Plus className="w-5 h-5" />
              Create Invoice
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 bg-white/10 text-white hover:bg-white"
          >
            <Link to="/items/new">
              <Receipt className="w-5 h-5" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
