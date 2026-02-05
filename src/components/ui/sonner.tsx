"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Base toast style
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-lg font-poppins text-sm",

          description: "group-[.toast]:text-muted-foreground",

          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",

          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          // Variant overrides (fixes your issue)
          success: "bg-green-500 text-white font-medium shadow-lg border-none",
          error: "bg-red-500 text-white font-medium shadow-lg border-none",
          warning: "bg-yellow-400 text-black font-medium shadow-lg border-none",
          info: "bg-blue-500 text-white font-medium shadow-lg border-none",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
