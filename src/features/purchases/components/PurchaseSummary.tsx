import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  subTotal: number;
  tax?: number;
  grandTotal: number;
}

export default function PurchaseSummary({
  subTotal,
  tax = 0,
  grandTotal,
}: Props) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Purchase Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>AED {subTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>AED {tax}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span className="text-blue-600">AED {grandTotal}</span>
        </div>
      </CardContent>
    </Card>
  );
}
