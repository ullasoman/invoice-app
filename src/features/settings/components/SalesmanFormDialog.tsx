import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salesmanSchema, SalesmanFormData } from "../validation/salesmanSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SalesmanFormData) => Promise<void>;
  initialValues?: SalesmanFormData | null;
}

const genPassword = (len = 10) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$#";
  return Array.from({ length: len })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

export default function SalesmanFormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SalesmanFormData>({
    resolver: zodResolver(salesmanSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      password: "",
    },
  });

  // ✅ Reset form when editing or clearing values
  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || "",
        phone_number: initialValues.phone_number || "",
        password: "",
      });
    } else {
      form.reset({
        name: "",
        phone_number: "",
        password: "",
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (data: SalesmanFormData) => {
    await onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Edit Salesman" : "Add Salesman"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Salesman name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+971501234567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password{" "}
                    <Badge variant="secondary" className="ml-2">
                      Manual / Generate
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          initialValues
                            ? "Leave blank to keep current"
                            : "Enter or generate"
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          form.setValue("password", genPassword(10))
                        }
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialValues ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
