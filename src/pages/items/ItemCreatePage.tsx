import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ItemForm from "@/features/items/components/ItemForm";
import { createItem } from "@/features/items/services/itemService";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function ItemCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    await createItem(formData);
    toast.success("Item created successfully");
    navigate("/items");
  };

  return (
    <div className="min-h-screen space-y-4">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Products Management", href: "/products" },
          { label: "Products" },
        ]}
      />

      {/* Header */}
      <PageHeader
        title="Create Item"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />
      <ItemForm onSubmit={handleSubmit} submitLabel="Create Item" />
    </div>
  );
}
