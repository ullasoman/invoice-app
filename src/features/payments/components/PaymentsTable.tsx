import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentBadge from "./PaymentBadge";
import { Payment } from "@/types";

const fmtAED = (n: number | string) => `AED ${Number(n ?? 0).toFixed(2)}`;

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment ID</TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length > 0 ? (
          payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>#{p.id}</TableCell>
              <TableCell>{p.payable?.invoice_number || "-"}</TableCell>
              <TableCell>{fmtAED(p.amount)}</TableCell>
              <TableCell>
                <PaymentBadge method={p.method} />
              </TableCell>
              <TableCell>
                {new Date(p.created_at!).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-6"
            >
              No payments recorded yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
