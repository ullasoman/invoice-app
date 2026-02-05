// src/pages/suppliers/SuppliersPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  SuppliersTable,
  SupplierFormDialog,
  DeleteSupplierDialog,
} from "@/features/suppliers";

import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { Supplier } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function SuppliersPage() {
  const {
    suppliers,
    filtered,
    loading,
    cities,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    refetch,
  } = useSuppliers();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null
  );

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <HeaderNavBar
        breadcrumbs={[{ label: "Purchase Management" }, { label: "Suppliers" }]}
      />
      <PageHeader
        title="Suppliers"
        actions={
          <Button
            onClick={() => {
              setEditingSupplier(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Create Supplier
          </Button>
        }
      />

      <div className="container mx-auto space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search name, phone, mobile, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v: "all" | "active" | "inactive") =>
                  setStatusFilter(v)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">
                {filtered.length} supplier(s) found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Suppliers List</CardTitle>
          </CardHeader>
          <CardContent>
            <SuppliersTable
              suppliers={filtered}
              loading={loading}
              onEdit={(s) => {
                setEditingSupplier(s);
                setFormOpen(true);
              }}
              onDelete={(s) => {
                setDeletingSupplier(s);
                setDeleteOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <SupplierFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingSupplier={editingSupplier}
        onSuccess={refetch}
      />
      <DeleteSupplierDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        supplier={deletingSupplier}
        onDeleted={refetch}
      />
    </div>
  );
}
