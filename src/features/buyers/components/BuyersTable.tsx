import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface BuyersTableProps {
  buyers: any[];
  loading: boolean;
  error: string | null;
  onEdit: (buyer: any) => void;
  onDelete: (buyer: any) => void;
  searchTerm?: string;
  statusFilter?: string;
  openCreate?: () => void;
}

export default function BuyersTable({
  buyers,
  loading,
  error,
  onEdit,
  onDelete,
  searchTerm,
  statusFilter = "all",
  openCreate,
}: BuyersTableProps) {
  if (loading) return <p>Loading customers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        {buyers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead>TRN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyers.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.email || "-"}</TableCell>
                  <TableCell>{b.phone_number || "-"}</TableCell>
                  <TableCell>{b.mobile_number || "-"}</TableCell>
                  <TableCell>{b.city?.name || "-"}</TableCell>
                  <TableCell>{b.trn_number || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={b.is_active ? "default" : "destructive"}>
                      {b.is_active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(b)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(b)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2">No customers found</p>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first customer."}
            </p>
            {!searchTerm && statusFilter === "all" && openCreate && (
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4" />
                Create First Customer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
