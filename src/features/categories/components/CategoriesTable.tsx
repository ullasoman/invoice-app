import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types";
import { useEffect } from "react";

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  pagination?: {
    current_page: number;
    last_page: number;
    total?: number;
  };
  onPageChange?: (page: number) => void;
}

export default function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: CategoriesTableProps) {
  // Generate visible pages with ellipsis
  const getVisiblePages = () => {
    if (!pagination) return [];
    const { current_page, last_page } = pagination;
    const pages: (number | string)[] = [];
    const delta = 2;

    const start = Math.max(2, current_page - delta);
    const end = Math.min(last_page - 1, current_page + delta);

    pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < last_page - 1) pages.push("...");
    if (last_page > 1) pages.push(last_page);

    return pages;
  };

  const pages = pagination ? getVisiblePages() : [];

  // Debugging section
  useEffect(() => {
    console.groupEnd();
  }, [pagination, pages, onPageChange]);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(cat)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(cat)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Integrated Pagination */}
      {pagination && pagination.last_page > 1 && onPageChange ? (
        <Pagination className="my-4">
          <PaginationContent>
            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page > 1)
                    onPageChange(pagination.current_page - 1);
                }}
                className={
                  pagination.current_page === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {/* Page numbers */}
            {pages.map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.current_page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page as number);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page < pagination.last_page)
                    onPageChange(pagination.current_page + 1);
                }}
                className={
                  pagination.current_page === pagination.last_page
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <div className="p-3 text-center text-xs text-muted-foreground">
          Pagination hidden — check console for details
        </div>
      )}
    </div>
  );
}
