import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Trash2, Save, FileText, Users, Package } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import EstimateSummary from "./EstimateSummary";
import CommandSelect from "@/shared/CommandSelect";
import CategorySelectField from "@/features/categories/components/CategorySelectField";
import { Form } from "@/components/ui/form"; // ✅ ShadCN form wrapper

import {
  fetchCategories,
  fetchUnits,
  fetchItemsByCategory,
} from "../services/estimateService";
import { EstimateFormData, estimateSchema } from "../validation/estimateSchema";
import { Category, Item, Unit } from "@/types";

interface EstimateFormProps {
  mode?: "create" | "edit";
  initialValues?: Partial<EstimateFormData>;
  onSubmit: (values: EstimateFormData) => Promise<void>;
  submitting?: boolean;
}

export default function EstimateForm({
  mode = "create",
  initialValues,
  onSubmit,
  submitting = false,
}: EstimateFormProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryItems, setCategoryItems] = useState<Record<string, Item[]>>(
    {}
  );
  const [units, setUnits] = useState<Unit[]>([]);

  // Create form instance
  const form = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      buyer_name: initialValues?.buyer_name || "",
      buyer_address: initialValues?.buyer_address || "",
      issue_date: initialValues?.issue_date || new Date(),
      notes: initialValues?.notes || "",
      status: initialValues?.status || "DRAFT",
      lines:
        initialValues?.lines && initialValues.lines.length > 0
          ? initialValues.lines
          : [
              {
                category_id: "",
                item_id: "",
                description: "",
                quantity: 1,
                unit: "",
                unit_price: 0,
                total_amount: 0,
              },
            ],
    },
  });

  const { control, handleSubmit, watch, setValue, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });

  const lines = watch("lines");

  // Load categories & units
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, unitsData] = await Promise.all([
          fetchCategories(),
          fetchUnits(),
        ]);
        setCategories(cats);
        setUnits(unitsData);
      } catch {
        toast.error("Failed to load categories or units");
      }
    };
    load();
  }, []);


  useEffect(() => {
    if (initialValues?.lines?.length) {
      const uniqueCategoryIds = [
        ...new Set(
          initialValues.lines
            .map((line) => line.category_id)
            .filter((id): id is string => !!id)
        ),
      ];

      if (uniqueCategoryIds.length) {
        uniqueCategoryIds.forEach((catId) => {
          fetchItemsByCategoryId(catId);
        });
      }
    }
  }, [initialValues]);

  const fetchItemsByCategoryId = async (categoryId: string) => {
    if (categoryItems[categoryId]) return;
    try {
      const items = await fetchItemsByCategory(categoryId);
      setCategoryItems((prev) => ({ ...prev, [categoryId]: items }));
    } catch {
      toast.error("Failed to load items");
    }
  };

  // Handle item selection
  const handleItemSelect = (index: number, itemId: string) => {
    const categoryId = getValues(`lines.${index}.category_id`);
    const items = categoryItems[categoryId] || [];
    const item = items.find((i) => String(i.id) === itemId);
    if (item) {
      setValue(`lines.${index}.item_id`, itemId);
      setValue(`lines.${index}.description`, item.name);
      setValue(`lines.${index}.unit_price`, item.selling_price);
      recalcTotal(index);
    }
  };

  const recalcTotal = (index: number) => {
    const qty = Number(getValues(`lines.${index}.quantity`)) || 0;
    const price = Number(getValues(`lines.${index}.unit_price`)) || 0;
    const total = qty * price;
    setValue(`lines.${index}.total_amount`, total);
  };

  const addLine = () => {
    append({
      category_id: "",
      item_id: "",
      description: "",
      quantity: 1,
      unit: "",
      unit_price: 0,
      total_amount: 0,
    });
  };

  const subTotal = lines.reduce(
    (sum, l) => sum + (Number(l.total_amount) || 0),
    0
  );

  const handleSave = async (status: "DRAFT" | "ISSUED") => {
    const formValues = getValues();
    const payload = {
      ...formValues,
      issue_date: format(formValues.issue_date, "yyyy-MM-dd"), // only convert for API
      status,
    };
    await onSubmit(payload as any);
  };

  return (
    // Wrap entire form inside ShadCN <Form> context
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) =>
          handleSave(values.status as "DRAFT" | "ISSUED")
        )}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      >
        <PageHeader
          title={mode === "create" ? "Create Estimate" : "Edit Estimate"}
          caption="Prepare an estimate for your customer"
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={submitting}
                onClick={() => handleSave("DRAFT")}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSave("ISSUED")}
                disabled={submitting}
                className="bg-blue-600 text-white"
              >
                <FileText className="w-4 h-4" />
                {submitting ? "Saving..." : "Issue Estimate"}
              </Button>
            </div>
          }
        />

        <div className="container mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Users className="w-5 h-5 mr-3 inline text-blue-600" />
                  Customer Details
                </CardTitle>
                <CardDescription>Enter customer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Controller
                    name="buyer_name"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Address</Label>
                  <Controller
                    name="buyer_address"
                    control={control}
                    render={({ field }) => <Textarea rows={2} {...field} />}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Controller
                    name="issue_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => <Textarea rows={3} {...field} />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Package className="w-5 h-5 mr-3 inline text-green-600" />
                  Line Items
                </CardTitle>
                <CardDescription>Add products/services</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {fields.map((field, index) => {
                    const categoryId = watch(`lines.${index}.category_id`);
                    const itemOptions =
                      categoryId && categoryItems[categoryId]
                        ? categoryItems[categoryId].map((i) => ({
                            value: String(i.id),
                            label: i.name,
                          }))
                        : [];

                    return (
                      <div
                        key={field.id}
                        className="p-6 border rounded-xl space-y-4 bg-white/80 dark:bg-slate-800/60"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-semibold">
                            Line Item {index + 1}
                          </h4>
                          {fields.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Category Select */}
                          <CategorySelectField
                            control={control}
                            name={`lines.${index}.category_id`}
                            label="Category"
                            onChange={(categoryId) => {
                              setValue(
                                `lines.${index}.category_id`,
                                categoryId
                              );
                              setValue(`lines.${index}.item_id`, "");
                              fetchItemsByCategoryId(categoryId);
                            }}
                          />

                          {/* Item */}
                          <div className="space-y-2">
                            <Label>Item</Label>
                            <CommandSelect
                              options={itemOptions}
                              value={watch(`lines.${index}.item_id`)}
                              onChange={(v) => handleItemSelect(index, v)}
                              placeholder="Select item"
                              searchPlaceholder="Search items..."
                              emptyText="No items"
                            />
                          </div>

                          {/* Quantity */}
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Controller
                              name={`lines.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    recalcTotal(index);
                                  }}
                                />
                              )}
                            />
                          </div>

                          {/* Unit */}
                          <div className="space-y-2">
                            <Label>Unit</Label>
                            <CommandSelect
                              options={units.map((u) => ({
                                value: u.name,
                                label: u.name,
                              }))}
                              value={watch(`lines.${index}.unit`)}
                              onChange={(v) =>
                                setValue(`lines.${index}.unit`, v)
                              }
                              placeholder="Select unit"
                              searchPlaceholder="Search units..."
                              emptyText="No units"
                            />
                          </div>

                          {/* Unit Price */}
                          <div className="space-y-2">
                            <Label>Unit Price</Label>
                            <Controller
                              name={`lines.${index}.unit_price`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    recalcTotal(index);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="bg-slate-50 p-3 rounded-md text-right">
                          <p className="font-medium">
                            Line Total: AED{" "}
                            {Number(
                              watch(`lines.${index}.total_amount`) || 0
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    type="button"
                    onClick={addLine}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" /> Add Line Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <EstimateSummary subtotal={subTotal} />
        </div>
      </form>
    </Form>
  );
}
