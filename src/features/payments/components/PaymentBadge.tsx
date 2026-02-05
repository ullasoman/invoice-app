import { Badge } from "@/components/ui/badge";

export default function PaymentBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    cash: "bg-green-100 text-green-700",
    card: "bg-blue-100 text-blue-700",
    bank_transfer: "bg-purple-100 text-purple-700",
    check: "bg-amber-100 text-amber-800",
  };

  return (
    <Badge
      className={colors[method] || "bg-secondary text-secondary-foreground"}
    >
      {method.replace("_", " ")}
    </Badge>
  );
}
