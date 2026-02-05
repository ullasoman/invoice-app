import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createSalesInvoice } from "@/features/sales/services/salesInvoiceService";
import SalesInvoiceForm from "@/features/sales/components/SalesInvoiceForm";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function SalesInvoiceCreatePage() {
  const navigate = useNavigate();

  const handleSave = async (payload: any) => {
    try {
      await createSalesInvoice(payload);
      toast.success("Invoice created successfully");
      navigate("/sales/invoices");
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create invoice");
      }
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Sales Management", href: "/sales/invoices" },
          { label: "Create Invoice" },
        ]}
      />
      <PageHeader
        title="Create Invoice"
        actions={
          <Button variant="outline" onClick={() => navigate("/sales/invoices")}>
            <ArrowLeft className="h-4 w-4" /> View Invoices
          </Button>
        }
      />

      <div className="container mx-auto">
        <SalesInvoiceForm onSubmit={handleSave} />
      </div>
    </div>
  );
}
