import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/features/items/hooks/useItems";
import ItemsTable from "@/features/items/components/ItemsTable";
import PageHeader from "@/components/layout/PageHeader";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function ItemsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: items = [], isLoading, deleteMutation } = useItems();

  const filtered = items.filter(
    (p: any) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen space-y-4">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Products Management", href: "/products" },
          { label: "Products" },
        ]}
      />

      <PageHeader
        title="Products"
        actions={
          <Button onClick={() => navigate("/items/new")}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-6">Loading...</p>
            ) : (
              <ItemsTable items={filtered} onDelete={deleteMutation.mutate} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
