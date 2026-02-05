import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ItemsTableProps {
  items: any[];
  onDelete: (id: string) => void;
}

export default function ItemsTable({ items, onDelete }: ItemsTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Sale</TableHead>
          <TableHead>Tax</TableHead>
          <TableHead>Min Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md border"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category?.name ?? "-"}</TableCell>
            <TableCell>{product.code ?? "-"}</TableCell>
            <TableCell>{product.unit}</TableCell>
            <TableCell>
              AED {parseFloat(product.purchase_price || "0").toFixed(2)}
            </TableCell>
            <TableCell>
              AED {parseFloat(product.selling_price || "0").toFixed(2)}
            </TableCell>
            <TableCell>
              {product.tax_rate ? `${parseFloat(product.tax_rate)}%` : "0%"}
            </TableCell>
            <TableCell>{product.alert_quantity}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/items/edit/${product.id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/items/view/${product.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
