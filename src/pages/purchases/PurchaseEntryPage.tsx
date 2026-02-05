import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/layout/PageHeader";
import PurchaseForm from "@/features/purchases/components/PurchaseForm";
import {
  fetchPurchase,
  createPurchase,
  updatePurchase,
} from "@/features/purchases/services/purchaseService";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PurchaseEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🧭 Load purchase for editing
  const loadPurchase = async () => {
    if (!id) return;
    try {
      const data = await fetchPurchase(id);
      setInitialValues({
        supplier_id: String(data.supplier_id),
        invoice_number: data.invoice_number,
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        notes: data.notes || "",
        lines: data.lines || [],
      });
    } catch {
      toast.error("Failed to load purchase");
    }
  };

  useEffect(() => {
    if (id) loadPurchase();
  }, [id]);

  // 🧩 Common save handler
  const handleSave = async (values: any, status: "DRAFT" | "ISSUED") => {
    try {
      setSubmitting(true);
      const payload = { ...values, status };

      if (id) {
        await updatePurchase(id, payload);
        toast.success("Purchase updated");
      } else {
        await createPurchase(payload);
        toast.success("Purchase created");
      }

      navigate("/purchases");
    } catch {
      toast.error("Failed to save purchase");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Purchase Management" },
          { label: "Create Purchase" },
        ]}
      />

      <PageHeader
        title={id ? "Edit Purchase" : "Create Purchase"}
        actions={
          <Button variant="outline" onClick={() => navigate("/purchases")}>
            <ArrowLeft className="h-4 w-4" /> View Purchases
          </Button>
        }
      />
      <div className="container mx-auto">
        <PurchaseForm
          initialValues={initialValues}
          onSaveDraft={(data) => handleSave(data, "DRAFT")}
          onIssue={(data) => handleSave(data, "ISSUED")}
        />
      </div>
    </div>
  );
}
