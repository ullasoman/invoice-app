import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SalesInvoiceSummary({ invoice }: { invoice: any }) {
  return (
    <Card className="sticky">
      <CardHeader>
        <CardTitle>Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal (Ex VAT)</span>
          <span>AED {invoice.sub_total}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT Total</span>
          <span>AED {invoice.vat_total}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span className="text-blue-600">
            AED {invoice.grand_total}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
