import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemOverview({
  invoices,
  customers,
  items,
  expenses,
}: any) {
  return (
    <Card>
      <CardHeader className="border-b p-4 space-y-0">
        <CardTitle className="text-xl font-medium mb-0">
          System Overview
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Your current data summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between border-b py-2">
          <span className="text-sm font-medium">Total Invoices</span>
          <Badge variant="secondary">{invoices.length}</Badge>
        </div>
        <div className="flex items-center justify-between border-b py-2">
          <span className="text-sm font-medium">Buyers</span>
          <Badge variant="secondary">{customers.length}</Badge>
        </div>
        <div className="flex items-center justify-between border-b py-2">
          <span className="text-sm font-medium">Items</span>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
        <div className="flex items-center justify-between border-b py-2">
          <span className="text-sm font-medium">Payments Received</span>
          <Badge variant="secondary">{expenses.length}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
