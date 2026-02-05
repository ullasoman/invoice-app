import { useEffect, useState } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import CommandSelect, { CommandOption } from "@/shared/CommandSelect";
import api from "@/shared/api/api";
import { DatePicker } from "@/components/ui/date-picker";
import CategorySelectField from "@/features/categories/components/CategorySelectField";
import {
  purchaseSchema,
  PurchaseFormData,
} from "@/features/purchases/validation/purchaseSchema";

interface Supplier {
  id: number;
  name: string;
  email?: string | null;
  mobile_number?: string | null;
  address?: string | null;
  city?: { name: string };
}

interface Item {
  id: string;
  name: string;
  category_id: number;
}

interface Tax {
  id: number;
  tax_name: string;
  tax_rate: number;
}

interface PurchaseFormProps {
  initialValues?: any;
  onSaveDraft: (payload: any) => void;
  onIssue: (payload: any) => void;
}

const UAE_VAT_RATE = 5;

export default function PurchaseForm({
  initialValues,
  onSaveDraft,
  onIssue,
}: PurchaseFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(
      purchaseSchema
    ) as unknown as Resolver<PurchaseFormData>,
    defaultValues: initialValues || {
      supplier_id: "",
      invoice_number: "",
      purchase_date: new Date().toISOString().split("T")[0],
      due_date: new Date().toISOString().split("T")[0],
      notes: "",
      lines: [
        {
          category_id: "",
          item_id: "",
          quantity: 1,
          unit: "",
          unit_price: 0,
          discount_type: null,
          discount_value: null,
          discount_amount: null,
          tax_id: null,
          sub_total: 0,
          tax_amount: 0,
          total_amount: 0,
        },
      ],
    },
  });

  const { control, handleSubmit, getValues, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });

  // ------------------ Fetch Data ------------------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [supRes, itemRes, taxRes] = await Promise.all([
          api.get("/suppliers"),
          api.get("/items"),
          api.get("/taxes"),
        ]);
        setSuppliers(supRes.data?.data || []);
        setItems(itemRes.data?.data || []);
        setTaxes(taxRes.data || []);
      } catch {
        toast.error("Failed to load suppliers or items");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------ Populate Form in Edit Mode ------------------
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      console.log("📝 Resetting form with initialValues:", initialValues);
      form.reset(initialValues);
    }
  }, [initialValues]);

  // ------------------ Calculation Helpers ------------------
  const calculateLineValues = (
    quantity: number,
    unitPrice: number,
    taxRate: number
  ) => {
    const subTotal = quantity * unitPrice;
    const taxAmount = (subTotal * taxRate) / 100;
    const totalAmount = subTotal + taxAmount;

    return {
      sub_total: Math.round(subTotal * 100) / 100,
      tax_amount: Math.round(taxAmount * 100) / 100,
      total_amount: Math.round(totalAmount * 100) / 100,
    };
  };

  // ✅ Fixed reactive recalculation - properly handling string to number conversion
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      // Only respond to changes inside lines
      if (!name?.startsWith("lines")) return;

      const match = name.match(/^lines\.(\d+)\.(quantity|unit_price|tax_id)/);
      if (!match) return;

      const index = parseInt(match[1], 10);
      const line = values.lines?.[index];
      if (!line) return;

      // Convert string values to numbers
      const quantity = parseFloat(String(line.quantity)) || 0;
      const unitPrice = parseFloat(String(line.unit_price)) || 0;

      const taxRate =
        taxes.find((t) => String(t.id) === line.tax_id)?.tax_rate ??
        UAE_VAT_RATE;

      const calc = calculateLineValues(quantity, unitPrice, taxRate);

      setValue(`lines.${index}.sub_total`, calc.sub_total, {
        shouldValidate: false,
      });
      setValue(`lines.${index}.tax_amount`, calc.tax_amount, {
        shouldValidate: false,
      });
      setValue(`lines.${index}.total_amount`, calc.total_amount, {
        shouldValidate: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [form, taxes, setValue]);

  // ------------------ Summary ------------------
  const allLines = watch("lines");
  const subTotal = allLines.reduce((s, l) => s + (Number(l.sub_total) || 0), 0);
  const vatTotal = allLines.reduce(
    (s, l) => s + (Number(l.tax_amount) || 0),
    0
  );
  const grandTotal = allLines.reduce(
    (s, l) => s + (Number(l.total_amount) || 0),
    0
  );

  const supplierOptions: CommandOption[] = suppliers.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const taxOptions: CommandOption[] = taxes.map((t) => ({
    value: String(t.id),
    label: `${t.tax_name} (${parseFloat(String(t.tax_rate))}%)`,
  }));

  const handleSave = (type: "DRAFT" | "ISSUED", values?: PurchaseFormData) => {
    const data = values || getValues();
    if (type === "DRAFT") onSaveDraft(data);
    else onIssue(data);
  };

  const selectedSupplier = suppliers.find(
    (s) => String(s.id) === form.watch("supplier_id")
  );

  // ------------------ Render ------------------
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) => handleSave("ISSUED", values))}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        <div className="xl:col-span-2 space-y-8">
          {/* Supplier Section */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier & Purchase Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="supplier_id"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Supplier *</Label>
                    <CommandSelect
                      options={supplierOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select supplier..."
                    />
                  </div>
                )}
              />

              <FormField
                control={control}
                name="invoice_number"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input {...field} />
                  </div>
                )}
              />

              <FormField
                control={control}
                name="purchase_date"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Purchase Date *</Label>
                    <DatePicker
                      value={new Date(field.value)}
                      onChange={(date) =>
                        field.onChange(date?.toISOString().split("T")[0])
                      }
                    />
                  </div>
                )}
              />

              <FormField
                control={control}
                name="due_date"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <DatePicker
                      value={new Date(field.value)}
                      onChange={(date) =>
                        field.onChange(date?.toISOString().split("T")[0])
                      }
                    />
                  </div>
                )}
              />

              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <div className="md:col-span-2 space-y-2">
                    <Label>Notes</Label>
                    <Textarea {...field} />
                  </div>
                )}
              />
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => {
                const itemOptions: CommandOption[] = items
                  .filter(
                    (i) =>
                      String(i.category_id) ===
                      form.watch(`lines.${index}.category_id`)
                  )
                  .map((i) => ({ value: String(i.id), label: i.name }));

                return (
                  <div
                    key={field.id}
                    className="border p-4 rounded-lg bg-white space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Line Item {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CategorySelectField
                        control={control}
                        name={`lines.${index}.category_id`}
                        label="Category *"
                      />

                      <FormField
                        control={control}
                        name={`lines.${index}.item_id`}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label>Item *</Label>
                            <CommandSelect
                              options={itemOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select item..."
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`lines.${index}.quantity`}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`lines.${index}.unit_price`}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label>Unit Price *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`lines.${index}.tax_id`}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label>Tax</Label>
                            <CommandSelect
                              options={taxOptions}
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="Select tax..."
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 text-sm border-t pt-3">
                      <div>
                        <p>Sub Total</p>
                        <p className="font-semibold">
                          AED{" "}
                          {Number(
                            form.watch(`lines.${index}.sub_total`)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p>Tax</p>
                        <p className="font-semibold">
                          AED{" "}
                          {Number(
                            form.watch(`lines.${index}.tax_amount`)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p>Total</p>
                        <p className="font-semibold text-blue-600">
                          AED{" "}
                          {Number(
                            form.watch(`lines.${index}.total_amount`)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() =>
                  append({
                    category_id: "",
                    item_id: "",
                    quantity: 1,
                    unit: "",
                    unit_price: 0,
                    discount_type: null,
                    discount_value: null,
                    discount_amount: null,
                    tax_id: null,
                    sub_total: 0,
                    tax_amount: 0,
                    total_amount: 0,
                  })
                }
              >
                <Plus className="w-4 h-4" /> Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Save Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave("DRAFT", form.getValues())}
            >
              Save Draft
            </Button>
            <Button type="submit">Issue Purchase</Button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          {selectedSupplier && (
            <Card>
              <CardHeader>
                <CardTitle>Supplier Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{selectedSupplier.name}</p>
                {selectedSupplier.address && <p>{selectedSupplier.address}</p>}
                {selectedSupplier.city?.name && (
                  <p>{selectedSupplier.city.name}</p>
                )}
                {selectedSupplier.mobile_number && (
                  <p>Phone: {selectedSupplier.mobile_number}</p>
                )}
                {selectedSupplier.email && (
                  <p>Email: {selectedSupplier.email}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (Ex VAT)</span>
                <span>AED {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT</span>
                <span>AED {vatTotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total (Inc VAT)</span>
                <span className="text-blue-600">
                  AED {grandTotal.toFixed(2)}
                </span>
              </div>
              <Badge variant="outline" className="mt-3 w-full justify-center">
                <Calendar className="w-4 h-4 mr-1" /> UAE VAT @ 5%
              </Badge>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
