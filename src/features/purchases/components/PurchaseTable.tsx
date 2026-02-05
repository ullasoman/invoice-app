import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";

interface Props {
  purchases: any[];
  onView: (purchase: any) => void;
  onEdit: (purchase: any) => void;
  onDelete: (purchase: any) => void;
  loading?: boolean;
}

export default function PurchaseTable({
  purchases,
  onView,
  onEdit,
  onDelete,
  loading,
}: Props) {
  if (loading)
    return (
      <div className="py-4 text-sm text-muted-foreground">
        Loading purchases...
      </div>
    );
  if (!purchases.length)
    return (
      <div className="py-6 text-sm text-muted-foreground">
        No purchases yet.
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.invoice_number}</TableCell>
            <TableCell>{p.supplier?.name || "-"}</TableCell>
            <TableCell>{formatDate(p.purchase_date)}</TableCell>
            <TableCell>AED {Number(p.grand_total || 0).toFixed(2)}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onView(p)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(p)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(p)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
