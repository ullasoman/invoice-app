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

import { buyerSchema } from "../validation/buyerSchema";
import { createBuyer, updateBuyer } from "../services/buyerService";
import api from "@/shared/api/api";
import { toast } from "sonner";

interface BuyerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBuyer?: any;
  onSuccess: () => void;
}

export default function BuyerFormDialog({
  open,
  onOpenChange,
  editingBuyer,
  onSuccess,
}: BuyerFormDialogProps) {
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const form = useForm({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      mobile_number: "",
      trn_number: "",
      street_address: "",
      city_id: "",
      is_active: 1,
    },
  });

  // Reset form values when editingBuyer changes
  useEffect(() => {
    if (editingBuyer) {
      form.reset({
        name: editingBuyer.name || "",
        email: editingBuyer.email || "",
        phone_number: editingBuyer.phone_number || "",
        mobile_number: editingBuyer.mobile_number || "",
        trn_number: editingBuyer.trn_number || "",
        street_address: editingBuyer.street_address || "",
        city_id: editingBuyer.city_id ? String(editingBuyer.city_id) : "",
        is_active:
          editingBuyer.is_active !== undefined ? editingBuyer.is_active : 1,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone_number: "",
        mobile_number: "",
        trn_number: "",
        street_address: "",
        city_id: "",
        is_active: 1,
      });
    }
  }, [editingBuyer, form]);

  useEffect(() => {
    if (open && !editingBuyer) form.reset();
  }, [open, editingBuyer]);

  // fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await api.get("/cities");
        setCities(res.data);
      } catch (err) {
        console.error("Failed to fetch cities", err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  const onSubmit = async (values: any) => {
    if (values.city_id) {
      values.city_id = Number(values.city_id);
    }

    try {
      if (editingBuyer) {
        await updateBuyer(editingBuyer.id, values);
        toast.success("Customer updated successfully");
      } else {
        await createBuyer(values);
        toast.success("Customer created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to save customer. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingBuyer ? "Edit Customer" : "Create Customer"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Buyer Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Ahmed Trading LLC" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone / Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
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
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+971 50 123 4567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email / TRN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="buyer@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trn_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TRN Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="15-digit TRN" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="street_address"
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

            {/* City / Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
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
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={String(field.value ?? 1)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {editingBuyer ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
