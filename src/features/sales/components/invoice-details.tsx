import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Building2,
  User,
} from "lucide-react";
import { formatNumber } from "@/utils/numberUtils";

interface InvoiceProps {
  invoice: any;
}

export function InvoiceDetails({ invoice }: InvoiceProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount: string | number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Responsive grid layout */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-3 max-w-full">
          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-2 w-full">
            {/* Status and Summary Info */}
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      className={`mt-2 ${getStatusColor(
                        invoice.payment_status
                      )}`}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {invoice.payment_status.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {formatDate(invoice.issue_date)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {formatDate(invoice.due_date)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {invoice.payment_mode || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FROM / BILL TO */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 w-full">
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">From</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {invoice.client.business_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.client.client_name}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Email:
                      </span>{" "}
                      {invoice.client.email}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Phone:
                      </span>{" "}
                      {invoice.client.mobile_number}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Client ID:
                      </span>{" "}
                      {invoice.client.client_id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Bill To</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {invoice.buyer.name}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Email:
                      </span>{" "}
                      {invoice.buyer.email}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Phone:
                      </span>{" "}
                      {invoice.buyer.phone_number}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Mobile:
                      </span>{" "}
                      {invoice.buyer.mobile_number}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">TRN:</span>{" "}
                      {invoice.buyer.trn_number}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Address:
                      </span>{" "}
                      {invoice.buyer.street_address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LINE ITEMS */}
            <Card className="w-full">
              <CardHeader>
                <h3 className="font-semibold">Invoice Items</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto w-full max-w-full rounded-md border border-gray-200">
                  <table className="min-w-[700px] w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="border p-2 text-left whitespace-nowrap">
                          Item
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          Qty
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          Unit
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          Rate
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          Amount
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          VAT %
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          VAT Amount
                        </th>
                        <th className="border p-2 text-right whitespace-nowrap">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lines.map((line: any) => (
                        <tr key={line.id} className="hover:bg-gray-50">
                          <td className="border p-2 whitespace-nowrap">
                            {line.description || line.item?.name || "Unnamed"}
                          </td>
                          <td className="border p-2 text-right">
                            {Number(line.quantity ?? 0).toFixed(2)}
                          </td>
                          <td className="border p-2 text-right">
                            {line.unit || "-"}
                          </td>
                          <td className="border p-2 text-right">
                            AED {Number(line.unit_price ?? 0).toFixed(2)}
                          </td>
                          <td className="border p-2 text-right">
                            AED {Number(line.sub_total ?? 0).toFixed(2)}
                          </td>
                          <td className="border p-2 text-right">
                            {formatNumber(line.tax?.tax_rate)}%
                          </td>
                          <td className="border p-2 text-right">
                            AED {Number(line.tax_amount ?? 0).toFixed(2)}
                          </td>
                          <td className="border p-2 text-right font-semibold">
                            AED {Number(line.total_amount ?? 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {invoice.notes && (
              <Card className="w-full">
                <CardHeader>
                  <h3 className="font-semibold">Notes</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {invoice.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE (Summary) */}
          <div className="space-y-6 lg:sticky lg:top-6 w-full">
            <Card className="w-full">
              <CardHeader>
                <h3 className="font-semibold">Payment Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.sub_total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (5%)</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.vat_total)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(invoice.grand_total)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paid Amount</span>
                    <span className="font-medium text-success">
                      {formatCurrency(invoice.paid_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due Amount</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.due_amount)}
                    </span>
                  </div>
                </div>

                {invoice.payment_status === "paid" && (
                  <div className="mt-4 rounded-lg bg-success/10 p-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">Payment Complete</span>
                    </div>
                    <p className="mt-1 text-sm text-success/80">
                      This invoice has been fully paid
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
