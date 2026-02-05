import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdjustFormData, adjustSchema } from "../validation/stockSchema";
import { StockRow } from "../types";
import { Minus, Plus } from "lucide-react";

export default function StockAdjustDialog({
  open,
  onOpenChange,
  stock,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  stock: StockRow | null;
  onSave: (
    productId: string,
    shopId: string,
    quantity: number,
    reason: string
  ) => Promise<void>;
}) {
  const form = useForm<AdjustFormData>({
    resolver: zodResolver(adjustSchema),
    defaultValues: { quantity: 0, reason: "" },
  });

  if (!stock) return null;

  const onSubmit = async (data: AdjustFormData) => {
    await onSave(stock.productId, stock.shopId, data.quantity, data.reason);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Adjustment</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(Number(field.value) - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input type="number" {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(Number(field.value) + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Adjustment</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
