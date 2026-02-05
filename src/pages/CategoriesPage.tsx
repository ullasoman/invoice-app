import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/features/categories/services/categoryService";
import CategoriesTable from "@/features/categories/components/CategoriesTable";
import CategoryFormDialog from "@/features/categories/components/CategoryFormDialog";
import { Category } from "@/types";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeleteCategoryDialog } from "@/features/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // Modals
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Selected items
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  const load = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchCategories(page);

      setCategories(res.data);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        total: res.total,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    load(1);
  }, []);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(data);
        toast.success("Category created successfully!");
      }

      setOpenFormDialog(false);
      setEditingCategory(null); // reset edit state
      load(1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
    }
  };

  // handle deletion
  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      setOpenDeleteDialog(false);
      load(1);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Categories Management" },
          { label: "Categories" },
        ]}
      />

      <PageHeader
        title="Categories"
        actions={
          <Button onClick={() => setOpenFormDialog(true)}>
            <Plus className="h-4 w-4 mr-1" /> Create Category
          </Button>
        }
      />

      <div className="container mx-auto">
        <CategoriesTable
          categories={categories}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => load(page)}
          onEdit={(cat) => {
            setEditingCategory(cat);
            setOpenFormDialog(true);
          }}
          onDelete={(cat) => {
            setDeletingCategory(cat);
            setOpenDeleteDialog(true);
          }}
        />
      </div>

      {/* Category Form Dialog (Add/Edit) */}
      <CategoryFormDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        initialValues={
          editingCategory
            ? {
                name: editingCategory.name,
                description: editingCategory.description,
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
      {/* Delete Category Dialog */}
      <DeleteCategoryDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
