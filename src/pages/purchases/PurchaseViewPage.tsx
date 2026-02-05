import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchPurchase } from "@/features/purchases/services/purchaseService";
import PurchaseSummary from "@/features/purchases/components/PurchaseSummary";
import api from "@/shared/api/api";
import PageHeader from "@/components/layout/PageHeader";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PrintableDocument from "@/features/print/PrintableDocument";
import { printHTML } from "@/utils/printUtils";
import { formatDate } from "@/utils/dateFormatter";

export default function PurchaseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<any | null>(null);

  const loadPurchase = async () => {
    try {
      const data = await fetchPurchase(id!);
      setPurchase(data);
    } catch {
      toast.error("Failed to load purchase");
    }
  };

  useEffect(() => {
    loadPurchase();
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await api.get(`/purchases/${purchase.id}/download`, {
        responseType: "blob",
      });

      const disposition = res.headers["content-disposition"];
      let filename = `purchase-${purchase.invoice_number}.pdf`;

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success("Purchase invoice PDF downloaded successfully");
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };


  if (!purchase) return <div className="p-8 text-center">Loading...</div>;


  const handlePrint = () => {
      const content = document.getElementById("printable-invoice")?.innerHTML;
      if (content) {
        const formattedDate = formatDate(purchase.issue_date, "Y-m-d"); // e.g. 2025-10-14
        printHTML(
          content,
          `Purchase Order #${purchase.invoice_number}-${formattedDate}-${purchase.supplier?.name}`
        );
      }
    };

  return (
    <>
      {/* Screen View */}
      <div className="min-h-screen space-y-6 no-print">
        <HeaderNavBar
          breadcrumbs={[
            { label: "Purchase Management", href: "/purchases" },
            { label: "Purchase Details" },
          ]}
        />

        <PageHeader
          title="Purchases"
          actions={
            <div className="flex gap-2">
              <Button onClick={handleDownload}>
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </Button>

              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          }
        />

        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{purchase.supplier?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {purchase.supplier?.address}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2 text-left">Product</th>
                      <th className="border p-2 text-right">Qty</th>
                      <th className="border p-2 text-right">Unit Price</th>
                      <th className="border p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.lines.map((l: any) => (
                      <tr key={l.id}>
                        <td className="border p-2">
                          {l.item?.name || l.description || "Unknown"}
                        </td>
                        <td className="border p-2 text-right">{l.quantity}</td>
                        <td className="border p-2 text-right">
                          AED {Number(l.unit_price).toFixed(2)}
                        </td>
                        <td className="border p-2 text-right">
                          AED {Number(l.total_amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          <PurchaseSummary
            subTotal={purchase.sub_total}
            tax={purchase.tax_amount || 0}
            grandTotal={purchase.grand_total}
          />
        </div>
      </div>
      {/* Printable Invoice - Hidden on screen, visible on print */}
      <div
        id="printable-invoice"
        style={{
          display: "none", // instead of display: none
        }}
      >
        <PrintableDocument type="purchase" document={purchase} />
      </div>
    </>
  );
}
