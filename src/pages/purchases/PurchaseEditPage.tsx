import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/layout/PageHeader";
import PurchaseForm from "@/features/purchases/components/PurchaseForm";
import {
  fetchPurchase,
  updatePurchase,
} from "@/features/purchases/services/purchaseService";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PurchaseEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ------------------ Load existing purchase ------------------
  useEffect(() => {
    if (!id) return;

    const loadPurchase = async () => {
      try {
        setLoading(true);
        const data = await fetchPurchase(id);

        const formatDate = (dateStr: string) =>
          dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

        // ✅ Map API response correctly to form fields
        setInitialValues({
          supplier_id: String(data.supplier_id),
          invoice_number: data.invoice_number || "",
          purchase_date:
            formatDate(data.purchase_date) ||
            new Date().toISOString().split("T")[0],
          due_date:
            formatDate(data.due_date) || new Date().toISOString().split("T")[0],
          notes: data.notes || "",
          lines:
            data.lines?.map((line: any) => ({
              id: line.id,
              category_id: String(line.category_id || ""),
              item_id: String(line.item_id || ""),
              description: line.item?.name || line.description || "",
              unit: line.unit || "",
              quantity: Number(line.quantity) || 1,
              unit_price: Number(line.unit_price) || 0, // ✅ FIXED: correct backend key
              discount_type: line.discount_type || null,
              discount_value:
                line.discount_value !== null
                  ? Number(line.discount_value)
                  : null,
              discount_amount:
                line.discount_amount !== null
                  ? Number(line.discount_amount)
                  : null,
              tax_id: line.tax_id ? String(line.tax_id) : null,
              sub_total: Number(line.sub_total) || 0,
              tax_amount: Number(line.tax_amount) || 0,
              total_amount: Number(line.total_amount) || 0,
            })) || [],
        });
      } catch (err) {
        console.error("❌ Failed to load purchase:", err);
        toast.error("Failed to load purchase details");
      } finally {
        setLoading(false);
      }
    };

    loadPurchase();
  }, [id]);

  // ------------------ Save Handlers ------------------
  const handleUpdate = async (payload: any) => {
    if (!id) return;
    try {
      setSaving(true);
      await updatePurchase(id, payload);
      toast.success("Purchase updated successfully");
      navigate("/purchases");
    } catch (err: any) {
      console.error("❌ Failed to update purchase:", err);
      toast.error("Failed to update purchase");
    } finally {
      setSaving(false);
    }
  };

  // ------------------ Draft & Issue Buttons ------------------
  const handleDraft = (payload: any) => handleUpdate(payload);
  const handleIssue = (payload: any) => handleUpdate(payload);

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Purchase Management" },
          { label: "Purchase Edit" },
        ]}
      />
      <PageHeader
        title="Purchases"
        actions={
          <Button variant="outline" onClick={() => navigate("/purchases")}>
            <ArrowLeft className="h-4 w-4" />
            View Purchases
          </Button>
        }
      />
      <div className="container mx-auto">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading purchase...
          </div>
        ) : (
          <PurchaseForm
            initialValues={initialValues}
            onSaveDraft={handleDraft}
            onIssue={handleIssue}
          />
        )}
      </div>
    </div>
  );
}
