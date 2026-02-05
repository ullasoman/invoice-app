import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteBuyer } from "../services/buyerService";
import { toast } from "sonner";

interface DeleteBuyerDialogProps {
  buyer: any | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteBuyerDialog({
  buyer,
  onClose,
  onDeleted,
}: DeleteBuyerDialogProps) {
  if (!buyer) return null;

  const handleDelete = async () => {
    try {
      await deleteBuyer(buyer.id);
      toast.success("Customer deleted successfully");
      onDeleted();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to delete customer. Please try again.";
      toast.error(msg);
    }
  };


  return (
    <Dialog open={!!buyer} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{buyer.name}</strong>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
