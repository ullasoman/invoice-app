import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import {
  fetchSalesInvoice,
  updateSalesInvoice,
} from "@/features/sales/services/salesInvoiceService";
import SalesInvoiceForm from "@/features/sales/components/SalesInvoiceForm";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function SalesInvoiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ------------------ Load Invoice ------------------
  useEffect(() => {
    if (!id) return;

    const loadInvoice = async () => {
      setLoading(true);
      try {
        const data = await fetchSalesInvoice(id);
        setInvoice(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load invoice details");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  // ------------------ Handle Update ------------------
  const handleUpdate = async (payload: any) => {
    if (!id) return;
    setSaving(true);

    try {
      await updateSalesInvoice(id, payload);
      toast.success("Invoice updated successfully");
      navigate("/sales/invoices");
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update invoice");
      }
    } finally {
      setSaving(false);
    }
  };

  // ------------------ Render ------------------
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        Loading invoice...
      </div>
    );

  if (!invoice)
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-center text-muted-foreground py-10">
          Invoice not found.
        </div>
      </div>
    );

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
        <SalesInvoiceForm
          initialValues={invoice}
          onSubmit={handleUpdate}
          saving={saving}
        />
      </div>
    </div>
  );
}
