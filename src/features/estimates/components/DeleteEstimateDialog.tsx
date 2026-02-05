import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Estimate } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  estimate?: Estimate | null;
  onConfirm: (id: number) => void;
}

export default function DeleteEstimateDialog({
  open,
  onOpenChange,
  estimate,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Estimate</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            Estimate #{estimate?.estimate_number}
          </span>
          ?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => estimate && onConfirm(estimate.id)}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
