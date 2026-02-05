import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema, ItemFormData } from "../validation/itemSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Upload, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/shared/api/api";
import CategorySelectField from "@/features/categories/components/CategorySelectField";

interface ItemFormProps {
  initialValues?: Partial<ItemFormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export default function ItemForm({
  initialValues,
  onSubmit,
  submitLabel,
}: ItemFormProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [units, setUnits] = useState<
    { id: number; name: string; short_name: string }[]
  >([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category: "",
      cartonRate: "",
      singlePieceRate: "",
      sellingPrice: "",
      taxRate: "5",
      tax: "0",
      quantity: "",
      units: "",
      alertQuantity: "",
      description: "",
      ...initialValues,
    },
  });

  // Show existing image when editing
  useEffect(() => {
    if (initialValues?.image && !imageFile) {
      setImagePreview(initialValues.image);
    }
  }, [initialValues, imageFile]);


  // VAT Calculation
  const sellingPrice = useWatch({
    control: form.control,
    name: "sellingPrice",
  });
  const taxRate = useWatch({ control: form.control, name: "taxRate" });

  useEffect(() => {
    const price = parseFloat(sellingPrice || "0");
    const rate = parseFloat(taxRate || "0");
    const taxAmount = ((price * rate) / 100).toFixed(2);
    form.setValue("tax", taxAmount);
  }, [sellingPrice, taxRate, form]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          api.get("/categories"),
          api.get("/units"),
        ]);
        setCategories(catRes.data || []);
        setUnits(unitRes.data || []);
      } catch {
        toast.error("Failed to load categories/units");
      }
    };
    fetchData();
  }, []);

  // Handle image upload (new file replaces preview)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (values: ItemFormData) => {
    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_id", values.category);
      formData.append("carton_rate", values.cartonRate);
      formData.append("single_piece_rate", values.singlePieceRate);
      formData.append("selling_price", values.sellingPrice);
      formData.append("tax_rate", values.taxRate);
      formData.append("tax", values.tax || "0");
      formData.append("quantity", values.quantity);
      formData.append("alert_quantity", values.alertQuantity);
      formData.append("unit", values.units);
      if (values.description)
        formData.append("description", values.description);
      if (imageFile) formData.append("image", imageFile);

      await onSubmit(formData);
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    } catch {
      toast.error("Failed to save item");
    }
  };

  return (
    <div className="container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 bg-white p-6 rounded-lg border"
        >
          {/* Image Preview */}
          {/* Image Preview Section */}
          <div>
            <Label className="text-sm font-medium">Product Image</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center w-24 h-16 bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Item Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter item name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CategorySelectField
              control={form.control}
              name="category"
              label="Category *"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["cartonRate", "singlePieceRate", "sellingPrice", "quantity"].map(
              (name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof ItemFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name.replace(/([A-Z])/g, " $1")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
          </div>

          {/* Tax, Units, Alert */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Rate (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Amount</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u.id} value={u.short_name}>
                          {u.name} ({u.short_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Quantity</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Optional description..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
