import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Building2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Estimate } from "@/types";
import {
  fetchEstimate,
  downloadEstimate,
} from "@/features/estimates/services/estimateService";
import api from "@/shared/api/api";
import { formatDate } from "@/utils/dateFormatter";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import PrintableDocument from "@/features/print/PrintableDocument";
import { printHTML } from "@/utils/printUtils";

export default function EstimateViewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchEstimate(Number(id));
        setEstimate(data);
      } catch {
        toast.error("Failed to load estimate");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!estimate) {
    return (
      <div className="p-8 text-center text-gray-500">
        {loading ? "Loading..." : "Estimate not found"}
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const res = await api.get(`/sales/estimates/${id}/download`, {
        responseType: "blob",
      });

      // Get filename from response headers (backend sets Content-Disposition)
      const disposition = res.headers["content-disposition"];

      let filename = `estimate-${id}.pdf`;

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
      link.download = filename; // use backend filename
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success("Estimate PDF downloaded successfully");
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    const content = document.getElementById("printable-invoice")?.innerHTML;
    if (content) {
      const formattedDate = formatDate(estimate.issue_date, "Y-m-d"); // e.g. 2025-10-14
      printHTML(
        content,
        `Quotation #${estimate.estimate_number}-${formattedDate}-${estimate.buyer_name}`
      );
    }
  };

  return (
    <>
      <div className="min-h-screen space-y-6">
        <HeaderNavBar
          breadcrumbs={[
            { label: "Estimate Management", href: "/estimates" },
            { label: "Estimate Details" },
          ]}
        />
        <PageHeader
          title="Estimate Details"
          caption={`Estimate No. ${estimate.estimate_number}`}
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => downloadEstimate(estimate.id)}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={() => handlePrint()}>
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          }
        />

        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Buyer + Details + Lines */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Buyer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{estimate.buyer_name}</p>
                <p className="text-sm text-gray-600">
                  {estimate.buyer_address}
                </p>
                {estimate.notes && (
                  <p className="mt-2 text-gray-700">Notes: {estimate.notes}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  Estimate Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-semibold">Estimate No: </span>
                  {estimate.estimate_number}
                </p>
                <p>
                  <span className="font-semibold">Issue Date: </span>
                  {formatDate(estimate.issue_date)}
                </p>
                <p>
                  <span className="font-semibold">Status: </span>
                  {estimate.status}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-right">Qty</th>
                      <th className="border p-2 text-right">Unit</th>
                      <th className="border p-2 text-right">Price</th>
                      <th className="border p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.lines.map((line) => (
                      <tr key={line.id}>
                        <td className="border p-2">
                          {line.description ||
                            line.item?.name ||
                            "Unnamed Item"}
                        </td>
                        <td className="border p-2 text-right">
                          {line.quantity}
                        </td>
                        <td className="border p-2 text-right">{line.unit}</td>
                        <td className="border p-2 text-right">
                          AED {line.unit_price}
                        </td>
                        <td className="border p-2 text-right">
                          AED {line.total_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Estimate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>AED {estimate.sub_total}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span className="text-blue-600">
                    AED {estimate.grand_total}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Printable Invoice - Hidden on screen, visible on print */}
      <div
        id="printable-invoice"
        style={{
          display: "none", // instead of display: none
        }}
      >
        <PrintableDocument type="quotation" document={estimate} />
      </div>
    </>
  );
}
