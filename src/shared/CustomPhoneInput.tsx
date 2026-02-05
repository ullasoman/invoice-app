import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // optional if you use custom styles
import { cn } from "@/lib/utils";
import React from "react";

export function PhoneNumberField({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="mobile_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mobile Number</FormLabel>
          <FormControl>
            <PhoneInput
              {...field}
              international
              defaultCountry="AE"
              placeholder="+971 50 123 4567"
              value={field.value}
              onChange={field.onChange}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              )}
              inputComponent={CustomInput}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// 👇 this ensures inner input behaves like ShadCN <Input />
const CustomInput = React.forwardRef<HTMLInputElement, any>(
  ({ value, onChange, ...props }, ref) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      {...props}
      className="flex-1 bg-transparent outline-none border-0 focus-visible:ring-0 text-sm"
    />
  )
);
CustomInput.displayName = "CustomInput";
