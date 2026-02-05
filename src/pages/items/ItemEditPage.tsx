import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ItemForm from "@/features/items/components/ItemForm";
import { fetchItem, updateItem } from "@/features/items/services/itemService";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

export default function ItemEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchItem(id)
        .then((data) => {
          setInitialValues({
            name: data.name,
            category: String(data.category_id),
            cartonRate: String(data.carton_rate),
            singlePieceRate: String(data.single_piece_rate),
            sellingPrice: String(data.selling_price),
            taxRate: String(data.tax_rate),
            tax: ((data.selling_price * data.tax_rate) / 100).toFixed(2),
            quantity: String(data.quantity),
            units: data.unit,
            alertQuantity: String(data.alert_quantity),
            description: data.description || "",
            image: data.image,
          });
        })
        .catch(() => toast.error("Failed to load item"));
    }
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    await updateItem(id, formData);
    toast.success("Item updated successfully");
    navigate("/items");
  };

  if (!initialValues) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen space-y-4">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Products Management", href: "/products" },
          { label: "Edit Product" },
        ]}
      />
      <PageHeader
        title="Edit Product"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/items`)}
          >
            Back
          </Button>
        }
      />
      <ItemForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Update Item"
      />
    </div>
  );
}
