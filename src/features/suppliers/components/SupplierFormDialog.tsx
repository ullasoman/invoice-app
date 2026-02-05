// src/features/suppliers/components/SupplierFormDialog.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { supplierSchema, SupplierFormData } from "../validation/supplierSchema";
import {
  createSupplier,
  updateSupplier,
  fetchCities,
} from "../services/supplierService";
import { City, Supplier } from "@/types";
import { toast } from "sonner";
import { PhoneNumberField } from "@/shared/CustomPhoneInput";

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSupplier?: Supplier | null;
  onSuccess?: () => void;
}

export default function SupplierFormDialog({
  open,
  onOpenChange,
  editingSupplier,
  onSuccess,
}: SupplierFormDialogProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [phone, setPhone] = useState<string | undefined>();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contact_person: "",
      tele_number: "",
      mobile_number: "",
      email: "",
      address: "",
      notes: "",
      city_id: "",
      is_active: "active",
    },
  });

  // preload values if editing
  useEffect(() => {
    if (editingSupplier) {
      form.reset({
        name: editingSupplier.name || "",
        contact_person: editingSupplier.contact_person || "",
        tele_number: editingSupplier.tele_number || "",
        mobile_number: editingSupplier.mobile_number || "",
        email: editingSupplier.email || "",
        address: editingSupplier.address || "",
        notes: editingSupplier.notes || "",
        city_id: editingSupplier.city?.id
          ? String(editingSupplier.city.id)
          : "",
        is_active: editingSupplier.is_active ? "active" : "inactive",
      });
    }
  }, [editingSupplier, form]);

  // fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await fetchCities();
        setCities(data);
      } catch {
        toast.error("Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  const onSubmit = async (values: SupplierFormData) => {
    const payload = {
      ...values,
      city_id: values.city_id ? Number(values.city_id) : null,
      is_active: values.is_active === "active" ? 1 : 0,
    };

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, payload);
        toast.success("Supplier updated successfully");
      } else {
        await createSupplier(payload);
        toast.success("Supplier created successfully");
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to save supplier. Try again.";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSupplier ? "Edit Supplier" : "Create Supplier"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Supplier Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Ahmed Trading LLC" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Ahmed" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="supplier@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone + Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tele_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+971 4 123 4567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PhoneNumberField form={form} />
            </div>
          
            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Address, building, area"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCities ? (
                          <SelectItem value="">Loading...</SelectItem>
                        ) : (
                          cities.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            {/* <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Optional notes..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingSupplier ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
