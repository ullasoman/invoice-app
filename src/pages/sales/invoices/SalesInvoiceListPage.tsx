import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import SalesInvoiceTable from "@/features/sales/components/SalesInvoiceTable";
import {
  fetchSalesInvoices,
  deleteSalesInvoice,
} from "@/features/sales/services/salesInvoiceService";
import PageHeader from "@/components/layout/PageHeader";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function SalesInvoiceListPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await fetchSalesInvoices();
      setInvoices(data);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleDelete = async (invoice: any) => {
    try {
      await deleteSalesInvoice(invoice.id);
      toast.success("Invoice deleted");
      loadInvoices();
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[{ label: "Sales Management" }, { label: "Invoices" }]}
      />
      <PageHeader
        title="Sales Invoices"
        actions={
          <Button onClick={() => navigate("/sales/invoices/new")}>
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        }
      />

      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Invoice List</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesInvoiceTable
              invoices={invoices}
              loading={loading}
              onView={(i) => navigate(`/sales/invoices/view/${i.id}`)}
              onEdit={(i) => navigate(`/sales/invoices/edit/${i.id}`)}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
