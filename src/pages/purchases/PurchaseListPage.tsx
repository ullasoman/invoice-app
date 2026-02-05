import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PurchaseTable from "@/features/purchases/components/PurchaseTable";
import {
  fetchPurchases,
  deletePurchase,
} from "@/features/purchases/services/purchaseService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function PurchaseListPage() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null); // purchase being deleted
  const [deleting, setDeleting] = useState(false);

  // ------------------ Load Purchases ------------------
  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await fetchPurchases();
      setPurchases(data);
    } catch {
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  // ------------------ Delete Handler ------------------
  const confirmDelete = (purchase: any) => {
    setDeleteTarget(purchase);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deletePurchase(deleteTarget.id);
      toast.success("Purchase deleted");
      setDeleteTarget(null);
      loadPurchases();
    } catch {
      toast.error("Failed to delete purchase");
    } finally {
      setDeleting(false);
    }
  };

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[{ label: "Purchase Management" }, { label: "Purchases" }]}
      />

      <PageHeader
        title="Purchases"
        actions={
          <Button onClick={() => navigate("/purchases/new")}>
            <Plus className="w-4 h-4" /> Create Purchase
          </Button>
        }
      />

      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Purchase List</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseTable
              purchases={purchases}
              loading={loading}
              onView={(p) => navigate(`/purchases/view/${p.id}`)}
              onEdit={(p) => navigate(`/purchases/edit/${p.id}`)}
              onDelete={confirmDelete} // open modal instead of confirm()
            />
          </CardContent>
        </Card>
      </div>

      {/* ------------------ Delete Confirmation Modal ------------------ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.invoice_number ||
                  `Purchase #${deleteTarget?.id}`}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
