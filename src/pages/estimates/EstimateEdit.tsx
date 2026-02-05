import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchEstimate,
  updateEstimate,
} from "@/features/estimates/services/estimateService";
import EstimateForm from "@/features/estimates/components/EstimateForm";
import { EstimateFormData } from "@/features/estimates/validation/estimateSchema";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function EstimateEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] =
    useState<Partial<EstimateFormData> | null>(null);

  useEffect(() => {
    if (id) {
      fetchEstimate(Number(id))
        .then((data) => {
          const transformed: Partial<EstimateFormData> = {
            buyer_name: data.buyer_name,
            buyer_address: data.buyer_address,
            issue_date: new Date(data.issue_date), // convert string → Date
            notes: data.notes,
            status:
              (data.status?.toUpperCase() as "DRAFT" | "ISSUED") || "DRAFT",
            lines: data.lines.map((line) => ({
              id: line.id,
              category_id: String(line.category_id || ""), // ✅ ADD THIS LINE
              item_id: String(line.item_id || ""),
              description: line.description,
              quantity: Number(line.quantity) || 1,
              unit: line.unit || "",
              unit_price: Number(line.unit_price) || 0,
              total_amount: Number(line.total_amount) || 0,
            })),
          };

          setInitialValues(transformed);
        })
        .catch(() => toast.error("Failed to load estimate"));
    }
  }, [id]);


  const handleSubmit = async (values: EstimateFormData) => {
    try {
      if (!id) return;
      await updateEstimate(Number(id), values);
      toast.success("Estimate updated successfully");
      navigate(`/estimates/${id}`);
    } catch {
      toast.error("Failed to update estimate");
    }
  };

  if (!initialValues) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Estimate Management", href: "/estimates" },
          { label: "Edit Estimate" },
        ]}
      />
      <EstimateForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
