import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { companySchema, CompanyFormData } from "../validation/companySchema";

interface Props {
  initialData?: (CompanyFormData & { logo_url?: string | null }) | null;
  cities: { id: number; name: string }[];
  onSubmit: (data: CompanyFormData, logo?: File | null) => void;
  saving: boolean;
}

export default function BusinessProfileForm({
  initialData,
  cities,
  onSubmit,
  saving,
}: Props) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      business_name: "",
      address: "",
      tele_phone_number: "",
      mobile_number: "",
      whatsapp_number: "",
      email: "",
      city_id: "",
      trn_number: "",
    },
  });

  // ✅ Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        business_name: initialData.business_name ?? "",
        address: initialData.address ?? "",
        tele_phone_number: initialData.tele_phone_number ?? "",
        mobile_number: initialData.mobile_number ?? "",
        whatsapp_number: initialData.whatsapp_number ?? "",
        email: initialData.email ?? "",
        city_id: initialData.city_id ?? "",
        trn_number: initialData.trn_number ?? "",
      });

      // ✅ show logo preview
      setLogoPreview(initialData.logo_url ?? null);
    }
  }, [initialData, form]);

  const handleSubmit = (values: CompanyFormData) => {
    onSubmit(values, logoFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Logo Upload */}
        {/* <div>
          <FormLabel>Business Logo</FormLabel>
          <div className="flex items-center gap-4 mt-2">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-16 w-16 rounded border object-cover"
              />
            )}
            <label className="cursor-pointer flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-muted/50">
              <Upload className="w-4 h-4" />
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogoFile(file);
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setLogoPreview(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div> */}

        {/* Fields */}
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Company name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Business address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="tele_phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>TRN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
