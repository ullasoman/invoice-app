import { useEffect, useState, useCallback, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { fetchCategories } from "@/features/categories/services/categoryService";

interface CategorySelectFieldProps {
  label?: string;
  control?: any; // RHF optional
  name?: string; // RHF optional
  value?: string; // manual mode
  onChange?: (val: string) => void; // external onChange
}

export default function CategorySelectField({
  label = "Category",
  control,
  name,
  value,
  onChange,
}: CategorySelectFieldProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isInitialLoaded = useRef(false);

  // Load paginated categories
  const loadCategories = useCallback(
    async (page = 1, append = false) => {
      if (loading) return;
      try {
        setLoading(true);
        const res = await fetchCategories(page, 20);
        setCategories((prev) => (append ? [...prev, ...res.data] : res.data));
        setPagination({
          current_page: res.current_page,
          last_page: res.last_page,
        });
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    if (!isInitialLoaded.current) {
      isInitialLoaded.current = true;
      loadCategories(1);
    }
  }, [loadCategories]);

  // Infinite scroll pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (loading) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
    if (nearBottom && pagination.current_page < pagination.last_page) {
      loadCategories(pagination.current_page + 1, true);
    }
  };

  // Shared list renderer
  const renderCategoryList = (
    selectedValue: string,
    handleSelect: (val: string) => void
  ) => (
    <PopoverContent
      className="w-full p-0 max-h-64 overflow-y-auto"
      onScroll={handleScroll}
    >
      <Command>
        <CommandInput placeholder="Search category..." />
        <CommandEmpty>No category found.</CommandEmpty>
        <CommandGroup>
          {categories.map((cat) => (
            <CommandItem
              key={cat.id}
              value={String(cat.id)}
              onSelect={() => {
                handleSelect(String(cat.id));
                setPopoverOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedValue === String(cat.id) ? "opacity-100" : "opacity-0"
                )}
              />
              {cat.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>

      {loading && (
        <div className="text-center py-2 text-xs text-muted-foreground">
          Loading...
        </div>
      )}
      {!loading && pagination.current_page === pagination.last_page && (
        <div className="text-center py-2 text-xs text-muted-foreground">
          End of list
        </div>
      )}
    </PopoverContent>
  );

  // Case 1: React Hook Form controlled
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? categories.find((c) => String(c.id) === field.value)
                          ?.name || "Select category"
                      : "Select category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              {renderCategoryList(field.value, (val) => {
                field.onChange(val); // update RHF
                onChange?.(val); //notify parent
              })}
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Case 2: Manual mode
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? categories.find((c) => String(c.id) === value)?.name ||
                "Select category"
              : "Select category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        {renderCategoryList(value || "", (val) => {
          onChange?.(val);
          setPopoverOpen(false);
        })}
      </Popover>
    </div>
  );
}
