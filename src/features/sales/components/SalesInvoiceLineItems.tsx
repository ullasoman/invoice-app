import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/utils/numberUtils";

export default function SalesInvoiceLineItems({ invoice }: { invoice: any }) {
  if (!invoice?.lines?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No line items found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Line Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Responsive Scroll Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="border p-2 text-left whitespace-nowrap">Item</th>
                <th className="border p-2 text-right whitespace-nowrap">Qty</th>
                <th className="border p-2 text-right whitespace-nowrap">
                  Unit
                </th>
                <th className="border p-2 text-right whitespace-nowrap">
                  Unit Price
                </th>
                <th className="border p-2 text-right whitespace-nowrap">
                  VAT %
                </th>
                <th className="border p-2 text-right whitespace-nowrap">
                  Subtotal
                </th>
                <th className="border p-2 text-right whitespace-nowrap">
                  VAT Amount
                </th>
                <th className="border p-2 text-right whitespace-nowrap">
                  Total (Inc VAT)
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line: any) => (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="border p-2 whitespace-nowrap">
                    {line.description || line.item?.name || "Unnamed Item"}
                  </td>
                  <td className="border p-2 text-right whitespace-nowrap">
                    {Number(line.quantity ?? 0).toFixed(2)}
                  </td>
                  <td className="border p-2 text-right whitespace-nowrap">
                    {line.unit || "-"}
                  </td>
                  <td className="border p-2 text-right whitespace-nowrap">
                    AED {Number(line.unit_price ?? 0).toFixed(2)}
                  </td>
                  <td className="border p-2 text-right whitespace-nowrap">
                    {formatNumber(line.tax?.tax_rate)}%
                  </td>
                  <td className="border p-2 text-right whitespace-nowrap">
                    AED {Number(line.sub_total ?? 0).toFixed(2)}
                  </td>
                  <td className="border p-2 text-right whitespace-nowrap">
                    AED {Number(line.tax_amount ?? 0).toFixed(2)}
                  </td>
                  <td className="border p-2 text-right font-semibold whitespace-nowrap">
                    AED {Number(line.total_amount ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
