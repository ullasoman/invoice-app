import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function RecentInvoices({
  recentInvoices,
}: {
  recentInvoices: any[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>Latest invoice activity</CardDescription>
      </CardHeader>
      <CardContent>
        {recentInvoices && recentInvoices.length > 0 ? (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => {
              // ✅ Safely handle backend field variations
              const total = Number(
                invoice.grand_total_inc_vat ?? invoice.grand_total ?? 0
              );

              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-none"
                >
                  <div>
                    <p className="text-sm font-medium">
                      #{invoice.invoice_number || invoice.invoice_no || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.issue_date
                        ? format(new Date(invoice.issue_date), "MMM dd, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      AED {total.toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "issued"
                          ? "secondary"
                          : "outline"
                      }
                      className="capitalize text-xs"
                    >
                      {invoice.status || "draft"}
                    </Badge>
                  </div>
                </div>
              );
            })}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/sales/invoices">View All Invoices</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No invoices yet
            </p>
            <Button asChild size="sm">
              <Link to="/invoices/new">Create First Invoice</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
