import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function SalesInvoiceBuyerInfo({ invoice }: { invoice: any }) {
  const buyer = invoice.buyer || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Buyer Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">{buyer.name || invoice.buyer_name}</p>
        {buyer.address && (
          <p className="text-sm text-gray-600">{buyer.address}</p>
        )}
        {invoice.notes && (
          <p className="mt-2 text-gray-700">Notes: {invoice.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
