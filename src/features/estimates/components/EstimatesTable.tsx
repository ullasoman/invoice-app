import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  FileText,
  Filter,
  Search,
  Eye,
  Pencil,
  Download,
  Plus,
} from "lucide-react";
import { Estimate } from "@/types";
import api from "@/shared/api/api";

interface EstimatesTableProps {
  onRefresh?: () => void;
}

export default function EstimatesTable({ onRefresh }: EstimatesTableProps) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState<Estimate | null>(
    null
  );

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales/estimates", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        },
      });
      setEstimates(res.data?.data || []);
    } catch {
      toast.error("Failed to load estimates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, [searchTerm, statusFilter]);

  const handleDownload = async (estimateId: number) => {
    try {
      const res = await api.get(`/sales/estimates/${estimateId}/download`, {
        responseType: "blob",
      });

      const disposition = res.headers["content-disposition"];
      let filename = `estimate-${estimateId}.pdf`;

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("Estimate PDF downloaded successfully");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  const handleDelete = async (estimateId: number) => {
    try {
      await api.delete(`/sales/estimates/${estimateId}`);
      toast.success("Estimate deleted successfully");
      fetchEstimates();
      if (onRefresh) onRefresh();
    } catch {
      toast.error("Failed to delete estimate");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter your estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search estimates, buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              {loading ? "Loading..." : `${estimates.length} estimate(s) found`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estimate List</CardTitle>
        </CardHeader>
        <CardContent>
          {estimates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate No</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell className="font-medium">
                      #{String(estimate.estimate_number)}
                    </TableCell>
                    <TableCell>{estimate.buyer_name || "N/A"}</TableCell>
                    <TableCell>
                      {format(new Date(estimate.issue_date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      AED {Number(estimate.grand_total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          estimate.status === "paid"
                            ? "success"
                            : estimate.status === "issued"
                            ? "default"
                            : estimate.status === "void"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {estimate.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/estimates/${estimate.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/estimates/edit/${estimate.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(estimate.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Dialog
                          open={
                            openDeleteConfirm &&
                            estimateToDelete?.id === estimate.id
                          }
                          onOpenChange={(open) => {
                            setOpenDeleteConfirm(open);
                            if (open) setEstimateToDelete(estimate);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Estimate</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                  Estimate #{estimate.estimate_number}
                                </span>
                                ? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setOpenDeleteConfirm(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  await handleDelete(estimate.id);
                                  setOpenDeleteConfirm(false);
                                }}
                              >
                                Yes, Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No estimates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first estimate"}
              </p>
              {!searchTerm && statusFilter === "ALL" && (
                <Button asChild>
                  <Link to="/estimates/new">
                    <Plus className="w-4 h-4" />
                    Create First Estimate
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
