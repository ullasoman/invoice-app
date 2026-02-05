// src/features/suppliers/components/SuppliersTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Supplier } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

interface SuppliersTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SuppliersTable({
  suppliers,
  loading,
  onEdit,
  onDelete,
}: SuppliersTableProps) {
  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!suppliers.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold mb-2">No suppliers found</p>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact Person</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.name}</TableCell>
            <TableCell>{s.contact_person || "-"}</TableCell>
            <TableCell>{s.email || "-"}</TableCell>
            <TableCell>{s.tele_number || "-"}</TableCell>
            <TableCell>{s.mobile_number || "-"}</TableCell>
            <TableCell>{s.city?.name || "-"}</TableCell>
            <TableCell>
              <Badge variant={!!s.is_active ? "default" : "destructive"}>
                {!!s.is_active ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(s)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(s)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
