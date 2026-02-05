import EstimatesTable from "@/features/estimates/components/EstimatesTable";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import TaxInvoice from "@/utils/printDemo";

export default function EstimateList() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[{ label: "Estimate Management" }, { label: "Estimates" }]}
      />
      <PageHeader
        title="Estimates"
        actions={
          <Button onClick={() => navigate("/estimates/new")}>
            <Plus className="h-4 w-4" /> Create Estimate
          </Button>
        }
      />

      <div className="container mx-auto">
        <EstimatesTable />
      </div>
    </div>
  );
}
