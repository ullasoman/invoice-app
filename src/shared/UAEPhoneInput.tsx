import React, { useState } from "react";
import { useMask } from "@react-input/mask";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface UAEPhoneInputProps {
  form: any;
  name: string;
  label: string;
  type?: "mobile" | "landline";
  placeholder?: string;
  required?: boolean;
}

/**
 * Reusable UAE Phone Input (Masked)
 * Supports both Mobile and Landline formats
 * Handles cursor position after +971 prefix
 * Works perfectly with ShadCN + React Hook Form
 */
export default function UAEPhoneInput({
  form,
  name,
  label,
  type = "mobile",
  placeholder = "+971 __ ___ ____",
  required = false,
}: UAEPhoneInputProps) {
  const [value, setValue] = useState("");

  // Shared mask for UAE numbers (+971 __ ___ ____)
  const inputRef = useMask({
    mask: "+971 __ ___ ____",
    replacement: { _: /\d/ },
    showMask: true,
    separate: true,
  });

  // Maintain proper cursor position after "+971 "
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const val = input.value;

    setTimeout(() => {
      if (!val || val === "+971 ") {
        input.setSelectionRange(5, 5);
      } else {
        const digitsOnly = val.replace(/[^\d]/g, "").slice(3);
        const expectedPosition =
          5 +
          Math.min(digitsOnly.length, 9) +
          Math.floor(digitsOnly.length / 3);
        input.setSelectionRange(expectedPosition, expectedPosition);
      }
    }, 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const clickPos = input.selectionStart || 0;
    setTimeout(() => {
      if (clickPos < 5) input.setSelectionRange(5, 5);
    }, 0);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: any
  ) => {
    const input = e.target;
    const val = input.value;
    setValue(val);
    fieldOnChange(val);

    setTimeout(() => {
      const digitsOnly = val.replace(/[^\d]/g, "").slice(3);
      if (digitsOnly.length > 0) {
        let pos = 5;
        if (digitsOnly.length <= 2) pos = 5 + digitsOnly.length;
        else if (digitsOnly.length <= 5)
          pos = 5 + 2 + 1 + (digitsOnly.length - 2);
        else pos = 5 + 2 + 1 + 3 + 1 + (digitsOnly.length - 5);
        input.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              ref={inputRef}
              type="tel"
              value={value}
              placeholder={placeholder}
              onChange={(e) => handleInput(e, field.onChange)}
              onFocus={handleFocus}
              onClick={handleClick}
              className="mt-1 border border-input bg-background rounded-xl h-12"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
