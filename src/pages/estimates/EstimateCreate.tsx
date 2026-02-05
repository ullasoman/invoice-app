import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createEstimate } from "@/features/estimates/services/estimateService";
import EstimateForm from "@/features/estimates/components/EstimateForm";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export default function EstimateCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (payload: any) => {
    try {
      const res = await createEstimate(payload);
      toast.success("Estimate created successfully");
      navigate(`/estimates/${res.id}`);
    } catch {
      toast.error("Failed to create estimate");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Estimate Management", href: "/estimates" },
          { label: "Create Estimate" },
        ]}
      />
      
      <EstimateForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
