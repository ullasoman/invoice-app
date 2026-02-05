import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Loader2, Mail, Printer } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import {
  fetchSalesInvoice,
  downloadSalesInvoice,
} from "@/features/sales/services/salesInvoiceService";
import SalesInvoiceBuyerInfo from "@/features/sales/components/SalesInvoiceBuyerInfo";
import SalesInvoiceDetailsInfo from "@/features/sales/components/SalesInvoiceDetailsInfo";
import SalesInvoiceLineItems from "@/features/sales/components/SalesInvoiceLineItems";
import SalesInvoiceSummary from "@/features/sales/components/SalesInvoiceSummary";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import { printHTML } from "@/utils/printUtils";
import PrintableDocument from "@/features/print/PrintableDocument";
import { formatDate } from "@/utils/dateFormatter";
import { InvoiceDetails } from "@/features/sales/components/invoice-details";

export default function SalesInvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ------------------ Load invoice ------------------
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        Loading invoice details...
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

  const handleDownload = async () => {
    try {
      await downloadSalesInvoice(invoice.id);
      toast.success("Invoice PDF downloaded successfully");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    const content = document.getElementById("printable-invoice")?.innerHTML;
    if (content) {
      const formattedDate = formatDate(invoice.issue_date, "Y-m-d"); // e.g. 2025-10-14
      printHTML(
        content,
        `Invoice #${invoice.invoice_number}-${formattedDate}-${invoice.buyer.name}`
      );
    }
  };

  return (
    <>
      {/* Print Styles - Only active during print */}
      <div className="min-h-screen no-print">
        <HeaderNavBar
          breadcrumbs={[
            { label: "Sales Management", href: "/sales/invoices" },
            { label: "Invoice Details" },
          ]}
        />
        {/* Header */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-5 md:pt-8">
          <div className="bg-primary text-primary-foreground rounded-xl px-4 py-8 md:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Invoice #{invoice.invoice_number}
                  </h1>
                  <p className="mt-1 text-sm text-primary-foreground/90">
                    Issued on {formatDate(invoice.issue_date)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                {/* <Button variant="secondary" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        <InvoiceDetails invoice={invoice} />
        {/* <PageHeader
          title={`Invoice #${invoice.invoice_number}`}
          actions={
            <div className="flex gap-2">
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
            </div>
          }
        /> */}

        {/* <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SalesInvoiceBuyerInfo invoice={invoice} />
            <SalesInvoiceDetailsInfo invoice={invoice} />
            <SalesInvoiceLineItems invoice={invoice} />
          </div>
          <div>
            <SalesInvoiceSummary invoice={invoice} />
          </div>
        </div> */}
      </div>

      {/* Printable Invoice - Hidden on screen, visible on print */}
      <div
        id="printable-invoice"
        style={{
          display: "none", // instead of display: none
        }}
      >
        <PrintableDocument type="sales" document={invoice} />
      </div>
    </>
  );
}

