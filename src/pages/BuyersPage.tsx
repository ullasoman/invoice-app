import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import {
  BuyersTable,
  BuyerFormDialog,
  DeleteBuyerDialog,
} from "@/features/buyers";

import { useBuyers } from "@/features/buyers/hooks/useBuyers";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function BuyersPage() {
  const { buyers, loading, error, refetch } = useBuyers();
  const [openForm, setOpenForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<any>(null);
  const [deletingBuyer, setDeletingBuyer] = useState<any>(null);

  return (
    <div className="min-h-screen space-y-4">
      {/* Header */}
      <HeaderNavBar
        breadcrumbs={[
          { label: "Sales Management", href: "/products" },
          { label: "Customers" },
        ]}
      />
      <PageHeader
        title="Customers"
        actions={
          <Button
            onClick={() => {
              setEditingBuyer(null);
              setOpenForm(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <div className="container mx-auto">
        <BuyersTable
          buyers={buyers}
          loading={loading}
          error={error}
          onEdit={(buyer) => {
            setEditingBuyer(buyer);
            setOpenForm(true);
          }}
          onDelete={(buyer) => setDeletingBuyer(buyer)}
        />
      </div>

      {/* Dialogs */}
      <BuyerFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        editingBuyer={editingBuyer}
        onSuccess={refetch}
      />
      <DeleteBuyerDialog
        buyer={deletingBuyer}
        onClose={() => setDeletingBuyer(null)}
        onDeleted={refetch}
      />
    </div>
  );
}
