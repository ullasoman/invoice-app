import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  caption?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  actions?: ReactNode; // For optional extra buttons or custom actions
}

export default function PageHeader({
  title,
  caption,
  buttonLabel,
  onButtonClick,
  actions,
}: PageHeaderProps) {
  return (
    <div className="container flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {caption && (
          <p className="text-sm text-muted-foreground">{caption}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {buttonLabel && onButtonClick && (
          <Button onClick={onButtonClick}>{buttonLabel}</Button>
        )}
      </div>
    </div>
  );
}
