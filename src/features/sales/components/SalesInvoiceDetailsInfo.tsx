import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { format } from "date-fns";

export default function SalesInvoiceDetailsInfo({ invoice }: { invoice: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-green-600" />
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <span className="font-semibold">Invoice No: </span>
          {invoice.invoice_number}
        </p>
        <p>
          <span className="font-semibold">Issue Date: </span>
          {format(new Date(invoice.issue_date), "dd MMM yyyy")}
        </p>
        {invoice.due_date && (
          <p>
            <span className="font-semibold">Due Date: </span>
            {format(new Date(invoice.due_date), "dd MMM yyyy")}
          </p>
        )}
        <p>
          <span className="font-semibold">Status: </span>
          {invoice.status}
        </p>
      </CardContent>
    </Card>
  );
}
