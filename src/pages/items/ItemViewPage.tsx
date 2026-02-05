import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ItemDetails from "@/features/items/components/ItemDetails";
import api from "@/shared/api/api";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ItemViewPage() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await api.get(`/items/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-4">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Products Management", href: "/products" },
          { label: "Product Details" },
        ]}
      />
      <ItemDetails
        item={item}
        showBack
        onEdit={() => console.log("Edit logic")}
        onRestock={() => console.log("Restock logic")}
      />
    </div>
  );
}
