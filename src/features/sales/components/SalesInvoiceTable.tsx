// src/features/sales/components/SalesInvoiceTable.tsx
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateFormatter";
import { Loader2, Eye, Trash2, Pencil } from "lucide-react";

interface Props {
  invoices: any[];
  loading: boolean;
  onView: (invoice: any) => void;
  onEdit?: (invoice: any) => void; // ✅ make optional
  onDelete: (invoice: any) => void;
}

export default function SalesInvoiceTable({
  invoices,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );

  if (!invoices.length)
    return (
      <div className="text-center py-10 text-muted-foreground">
        No invoices found
      </div>
    );

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-2 text-left">#</th>
          <th className="p-2 text-left">Customer</th>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-right">Total</th>
          <th className="p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} className="border-t">
            <td className="p-2">{inv.invoice_number}</td>
            <td className="p-2">{inv.buyer.name}</td>
            <td className="p-2">{formatDate(inv.issue_date, "M d, Y")}</td>
            <td className="p-2 text-right">AED {inv.grand_total}</td>
            <td className="p-2 text-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onView(inv)}>
                <Eye className="h-4 w-4" />
              </Button>

              {/* ✅ Edit button only if prop provided */}
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(inv)}>
                  <Pencil className="h-4 w-4 text-blue-500" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(inv)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
