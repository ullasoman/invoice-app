import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentFormData, paymentSchema } from "../validation/paymentSchema";
import { createPayment, fetchInvoices } from "../services/paymentService";
import { toast } from "sonner";

export default function PaymentForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {

  const resolver: Resolver<PaymentFormData> = zodResolver(
    paymentSchema
  ) as Resolver<PaymentFormData>;

  const form = useForm<PaymentFormData>({
    resolver,
    defaultValues: {
      invoice_id: "",
      amount: 0,
      method: "cash",
      reference: "",
      notes: "",
    },
  });


  const [invoices, setInvoices] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ next_page_url: string | null }>({
    next_page_url: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // -------------------- Load Invoices --------------------
  const loadInvoices = async (url?: string) => {
    try {
      setLoading(true);
      const res = await fetchInvoices(url); // supports URL pagination
      const { data, next_page_url } = res;
      setInvoices((prev) => [...prev, ...data]);
      setMeta({ next_page_url });
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // -------------------- Infinite scroll handler --------------------
  const handleScroll = (e: any) => {
    const el = e.target;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10 &&
      meta.next_page_url &&
      !loading
    ) {
      loadInvoices(meta.next_page_url);
    }
  };

  // -------------------- Auto-fill amount --------------------
  const handleInvoiceSelect = (invoiceId: string) => {
    form.setValue("invoice_id", invoiceId);
    const selected = invoices.find((i) => String(i.id) === invoiceId);
    if (selected) {
      const due =
        Number(selected.grand_total || 0) - Number(selected.paid_amount || 0);
      form.setValue("amount", Number(due.toFixed(2)));
    }
  };

  // -------------------- Submit --------------------
  const handleSubmit = async (data: PaymentFormData) => {
    try {
      setSaving(true);
      await createPayment({
        invoice_id: data.invoice_id,
        amount: data.amount,
        method: data.method,
        reference: data.reference || null,
        notes: data.notes || null,
      });

      toast.success("Payment recorded successfully");
      form.reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to record payment. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };
  // -------------------- Render --------------------
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Record Payment</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Invoice */}
          <FormField
            control={form.control}
            name="invoice_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice</FormLabel>
                <Select
                  onValueChange={handleInvoiceSelect}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loading
                            ? "Loading invoices..."
                            : "Select unpaid invoice"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {invoices.length === 0 && !loading && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No unpaid invoices
                      </div>
                    )}
                    {invoices.map((inv) => {
                      const due =
                        Number(inv.grand_total_inc_vat || 0) -
                        Number(inv.paid_amount || 0);
                      return (
                        <SelectItem key={inv.id} value={String(inv.id)}>
                          {inv.invoice_number} — Due: AED {due.toFixed(2)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount + Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (AED)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      } // ✅ always number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Reference */}
          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input placeholder="Transaction or check number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Optional notes" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
