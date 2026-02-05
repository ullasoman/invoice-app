import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface Salesman {
  id: string | number;
  name: string;
  phone_number?: string | null;
  created_at?: string;
}

interface Props {
  salesmen: Salesman[];
  onEdit: (salesman: Salesman) => void;
  onDelete: (id: string | number) => void;
  loading?: boolean;
}

const fmtDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

export default function SalesmenTable({
  salesmen,
  onEdit,
  onDelete,
  loading,
}: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState<Salesman | null>(
    null
  );

  const handleConfirmDelete = () => {
    if (selectedSalesman) {
      onDelete(selectedSalesman.id);
      setDeleteDialogOpen(false);
      setSelectedSalesman(null);
    }
  };

  if (loading)
    return (
      <div className="py-4 text-sm text-muted-foreground">
        Loading salesmen...
      </div>
    );

  if (!salesmen.length)
    return (
      <div className="py-6 text-sm text-muted-foreground">
        No salesmen yet. Create the first one.
      </div>
    );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesmen.map((s) => (
            <TableRow key={String(s.id)}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.phone_number || "-"}</TableCell>
              <TableCell>{fmtDate(s.created_at)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(s)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedSalesman(s);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Salesman</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {selectedSalesman?.name || "this salesman"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
