import { useEffect, useState } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  FileText,
  Calculator,
  Package,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { Buyer, Item, Unit } from "@/types";
import { format } from "date-fns";
import api from "@/shared/api/api";
import CommandSelect from "@/shared/CommandSelect";
import CategorySelectField from "@/features/categories/components/CategorySelectField";
import { Form } from "@/components/ui/form";

const UAE_VAT_RATE = 5;

// ------------------ SCHEMA ------------------
const invoiceLineSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  item_id: z.string().min(1, "Item is required"),

  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Quantity must be greater than 0"),
  ),

  unit: z.string().min(1, "Unit is required"),

  unit_price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Unit price must be 0 or greater"),
  ),

  tax_percentage: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "VAT must be 0 or greater"),
  ),

  sub_total: z.number(),
  tax_amount: z.number(),
  total_amount: z.number(),
});

const salesInvoiceSchema = z.object({
  buyer_id: z.string().min(1, "Buyer is required"),
  issue_date: z.string(),
  due_date: z.string(),
  notes: z.string().optional(),
  lines: z.array(invoiceLineSchema),
});

type SalesInvoiceFormData = z.infer<typeof salesInvoiceSchema>;

// ------------------ UTIL ------------------
const calculateLineValues = (
  quantity: number,
  unitPrice: number,
  taxPercent: number,
) => {
  const sub_total = quantity * unitPrice;
  const tax_amount = (sub_total * taxPercent) / 100;
  const total_amount = sub_total + tax_amount;
  return {
    sub_total: Math.round(sub_total * 100) / 100,
    tax_amount: Math.round(tax_amount * 100) / 100,
    total_amount: Math.round(total_amount * 100) / 100,
  };
};

const convertToWords = (amount: number) => `${amount.toFixed(2)} AED only`;

export default function SalesInvoiceForm({
  initialValues,
  onSubmit,
  saving,
}: {
  initialValues?: any;
  onSubmit: (payload: any) => void;
  saving?: boolean;
}) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryItems, setCategoryItems] = useState<Record<string, Item[]>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const form = useForm<SalesInvoiceFormData>({
    resolver: zodResolver(salesInvoiceSchema) as Resolver<SalesInvoiceFormData>,
    defaultValues: {
      buyer_id: "",
      issue_date: format(new Date(), "yyyy-MM-dd"),
      due_date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
      lines: [
        {
          category_id: "",
          item_id: "",
          quantity: 1,
          unit: "",
          unit_price: 0,
          tax_percentage: UAE_VAT_RATE,
          sub_total: 0,
          tax_amount: 0,
          total_amount: 0,
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitted },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  // ------------------ Fetch Data ------------------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [buyerRes, unitRes, categoryRes] = await Promise.all([
          api.get("/buyers"),
          api.get("/units"),
          api.get("/categories"),
        ]);
        setBuyers(buyerRes.data || []);
        setUnits(unitRes.data || []);
        setCategories(categoryRes.data || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------ Load Initial Values ------------------
  useEffect(() => {
    if (initialValues) {
      // Format the data to match the form structure
      const formattedData = {
        buyer_id: String(initialValues.buyer_id || ""),
        issue_date:
          initialValues.issue_date || format(new Date(), "yyyy-MM-dd"),
        due_date: initialValues.due_date || format(new Date(), "yyyy-MM-dd"),
        notes: initialValues.notes || "",
        lines: initialValues.lines?.map((line: any) => ({
          category_id: String(line.category_id || ""),
          item_id: String(line.item_id || ""),
          quantity: Number(line.quantity) || 1,
          unit: line.unit || "",
          unit_price: Number(line.unit_price) || 0,
          tax_percentage: Number(line.tax_percentage) || UAE_VAT_RATE,
          sub_total: Number(line.sub_total) || 0,
          tax_amount: Number(line.tax_amount) || 0,
          total_amount: Number(line.total_amount) || 0,
        })) || [
          {
            category_id: "",
            item_id: "",
            quantity: 1,
            unit: "",
            unit_price: 0,
            tax_percentage: UAE_VAT_RATE,
            sub_total: 0,
            tax_amount: 0,
            total_amount: 0,
          },
        ],
      };

      reset(formattedData);

      // Pre-fetch items for each category
      initialValues.lines?.forEach((line: any) => {
        if (line.category_id) {
          fetchItemsByCategory(String(line.category_id));
        }
      });
    }
  }, [initialValues, reset]);

  const fetchItemsByCategory = async (categoryId: string) => {
    if (categoryItems[categoryId]) return;
    try {
      const res = await api.get(`/items?category_id=${categoryId}`);
      setCategoryItems((prev) => ({
        ...prev,
        [categoryId]: res.data?.data || [],
      }));
    } catch {
      toast.error("Failed to fetch items");
    }
  };

  // ------------------ Auto Calculation (FIXED) ------------------
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (!name || !name.startsWith("lines.")) return;

      // Extract the line index from the field name (e.g., "lines.0.quantity" -> 0)
      const match = name.match(
        /^lines\.(\d+)\.(quantity|unit_price|tax_percentage)$/,
      );
      if (!match) return;

      const index = parseInt(match[1], 10);
      const line = getValues(`lines.${index}`);

      const calc = calculateLineValues(
        Number(line.quantity) || 0,
        Number(line.unit_price) || 0,
        Number(line.tax_percentage) || 0,
      );

      // Only update if values have changed to prevent infinite loops
      if (
        line.sub_total !== calc.sub_total ||
        line.tax_amount !== calc.tax_amount ||
        line.total_amount !== calc.total_amount
      ) {
        setValue(`lines.${index}.sub_total`, calc.sub_total, {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue(`lines.${index}.tax_amount`, calc.tax_amount, {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue(`lines.${index}.total_amount`, calc.total_amount, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, getValues]);

  useEffect(() => {
    if (!isSubmitted) return;

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted errors before saving.");
    }
  }, [errors, isSubmitted]);

  // ------------------ Derived Totals ------------------
  const lines = watch("lines");
  const subTotal = lines.reduce((sum, l) => sum + (l.sub_total || 0), 0);
  const vatTotal = lines.reduce((sum, l) => sum + (l.tax_amount || 0), 0);
  const grandTotal = subTotal + vatTotal;
  const amountInWords = convertToWords(grandTotal);

  const buyerOptions = buyers.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));
  const unitOptions = units.map((u) => ({ value: u.name, label: u.name }));

  const addLine = () => {
    append({
      category_id: "",
      item_id: "",
      quantity: 1,
      unit: "",
      unit_price: 0,
      tax_percentage: UAE_VAT_RATE,
      sub_total: 0,
      tax_amount: 0,
      total_amount: 0,
    });
  };

  const selectItem = async (index: number, itemId: string) => {
    const categoryId = lines[index].category_id;
    const item = categoryItems[categoryId]?.find(
      (i) => String(i.id) === itemId,
    );

    if (item) {
      setValue(`lines.${index}.unit_price`, item.selling_price || 0);
      if (item.unit) {
        setValue(`lines.${index}.unit`, item.unit);
      }
    }
  };

  // Validate quantity in real-time
  const handleQuantityChange = (index: number, value: number) => {
    const categoryId = getValues(`lines.${index}.category_id`);
    const itemId = getValues(`lines.${index}.item_id`);
    const item = categoryItems[categoryId]?.find(
      (i) => String(i.id) === itemId,
    );

    if (!item) {
      setValue(`lines.${index}.quantity`, value);
      return;
    }

    if (value > item.quantity) {
      toast.error(
        `Only ${item.quantity} ${item.unit ?? ""} of ${
          item.name
        } available in stock.`,
      );
      return; // prevent setting invalid quantity
    }

    setValue(`lines.${index}.quantity`, value);
  };

  // Validate unit price in real-time
  const handlePriceChange = (index: number, value: number) => {
    const categoryId = getValues(`lines.${index}.category_id`);
    const itemId = getValues(`lines.${index}.item_id`);
    const item = categoryItems[categoryId]?.find(
      (i) => String(i.id) === itemId,
    );

    if (!item) {
      setValue(`lines.${index}.unit_price`, value);
      return;
    }

    if (value < item.selling_price) {
      toast.error(
        `Price for ${item.name} cannot be less than AED ${item.selling_price}.`,
      );
      return; // prevent setting invalid price
    }

    setValue(`lines.${index}.unit_price`, value);
  };

  // ------------------ Submit ------------------
  const handleSave = (data: SalesInvoiceFormData) => onSubmit(data);

  // ------------------ Render ------------------
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start"
      >
        {/* LEFT SIDE */}
        <div className="xl:col-span-2 space-y-8">
          {/* Buyer Info */}
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                Customer & Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <Label>Customer *</Label>
                  <CommandSelect
                    options={buyerOptions}
                    value={watch("buyer_id")}
                    onChange={(val) =>
                      setValue("buyer_id", val, { shouldValidate: true })
                    }
                    placeholder="Select customer..."
                  />
                  {errors.buyer_id && (
                    <p className="text-sm text-red-500">
                      {errors.buyer_id.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <DatePicker
                    value={new Date(watch("issue_date"))}
                    onChange={(date) =>
                      setValue(
                        "issue_date",
                        date?.toISOString().split("T")[0] || "",
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <DatePicker
                    value={new Date(watch("due_date"))}
                    onChange={(date) =>
                      setValue(
                        "due_date",
                        date?.toISOString().split("T")[0] || "",
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={watch("notes")}
                  onChange={(e) => setValue("notes", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <Package className="w-5 h-5 mr-3 text-green-600" />
                Line Items
              </CardTitle>
              <CardDescription>
                Add products or services to this invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {fields.map((field, index) => {
                  const categoryId = watch(`lines.${index}.category_id`);
                  const itemsForCategory = categoryItems[categoryId] || [];
                  const itemOptions = itemsForCategory.map((i) => ({
                    value: String(i.id),
                    label: i.name,
                    subtitle: `${i.sku} - AED ${i.selling_price}`,
                  }));

                  return (
                    <div
                      key={field.id}
                      className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Line Item {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <CategorySelectField
                            control={control}
                            name={`lines.${index}.category_id`}
                            label="Category"
                            onChange={(categoryId) => {
                              setValue(
                                `lines.${index}.category_id`,
                                categoryId,
                              );
                              setValue(`lines.${index}.item_id`, "");
                              fetchItemsByCategory(categoryId);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Select Item *</Label>

                          <CommandSelect
                            options={itemOptions}
                            value={watch(`lines.${index}.item_id`) || ""}
                            onChange={(v) => {
                              setValue(`lines.${index}.item_id`, v, {
                                shouldValidate: true,
                              });

                              selectItem(index, v);
                            }}
                            placeholder="Select item..."
                          />

                          {errors.lines?.[index]?.item_id && (
                            <p className="text-sm text-red-500">
                              {errors.lines[index]?.item_id?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            min={0}
                            value={watch(`lines.${index}.quantity`)}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Unit *</Label>

                          <CommandSelect
                            options={unitOptions}
                            value={watch(`lines.${index}.unit`) || ""}
                            onChange={(v) =>
                              setValue(`lines.${index}.unit`, v, {
                                shouldValidate: true,
                              })
                            }
                            placeholder="Select unit..."
                          />

                          {errors.lines?.[index]?.unit && (
                            <p className="text-sm text-red-500">
                              {errors.lines[index]?.unit?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Unit Price *</Label>

                          <Input
                            type="number"
                            min={0}
                            value={watch(`lines.${index}.unit_price`)}
                            onChange={(e) =>
                              handlePriceChange(
                                index,
                                Number(e.target.value) || 0,
                              )
                            }
                            className={
                              errors.lines?.[index]?.unit_price
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }
                          />

                          {errors.lines?.[index]?.unit_price && (
                            <p className="text-sm text-red-500">
                              {errors.lines[index]?.unit_price?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>VAT % *</Label>

                          <Input
                            type="number"
                            min={0}
                            value={watch(`lines.${index}.tax_percentage`)}
                            onChange={(e) =>
                              setValue(
                                `lines.${index}.tax_percentage`,
                                Number(e.target.value) || 0,
                                { shouldValidate: true },
                              )
                            }
                            className={
                              errors.lines?.[index]?.tax_percentage
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }
                          />

                          {errors.lines?.[index]?.tax_percentage && (
                            <p className="text-sm text-red-500">
                              {errors.lines[index]?.tax_percentage?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Totals Section */}
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                              Subtotal
                            </p>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              AED{" "}
                              {(watch(`lines.${index}.sub_total`) || 0).toFixed(
                                2,
                              )}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                              VAT ({watch(`lines.${index}.tax_percentage`)}%)
                            </p>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              AED{" "}
                              {(
                                watch(`lines.${index}.tax_amount`) || 0
                              ).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                              Total (Inc VAT)
                            </p>
                            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              AED{" "}
                              {(
                                watch(`lines.${index}.total_amount`) || 0
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addLine}
                  className="w-full py-3 border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Line Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" /> Save Invoice
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 backdrop-blur-sm xl:sticky xl:top-6 self-start h-fit">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calculator className="w-5 h-5 mr-3 text-orange-600" />
              Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal (Ex VAT)</span>
                <span className="font-medium">AED {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>VAT Total</span>
                <span className="font-medium">AED {vatTotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-slate-100">
                <span>Total (Inc VAT)</span>
                <span className="text-blue-600 dark:text-blue-400">
                  AED {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
            {grandTotal > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                  Amount in Words:
                </p>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 break-words">
                  {amountInWords}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
