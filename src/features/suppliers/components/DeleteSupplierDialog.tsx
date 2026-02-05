// src/features/suppliers/components/DeleteSupplierDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types";
import { deleteSupplier } from "../services/supplierService";
import { toast } from "sonner";

interface DeleteSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onDeleted?: () => void;
}

export default function DeleteSupplierDialog({
  open,
  onOpenChange,
  supplier,
  onDeleted,
}: DeleteSupplierDialogProps) {
  const handleDelete = async () => {
    if (!supplier) return;
    try {
      await deleteSupplier(supplier.id);
      toast.success("Supplier deleted successfully");
      onDeleted?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete supplier");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Supplier</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{supplier?.name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
