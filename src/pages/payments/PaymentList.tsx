import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentForm from "@/features/payments/components/PaymentForm";
import PaymentsTable from "@/features/payments/components/PaymentsTable";
import { fetchPayments } from "@/features/payments/services/paymentService";
import { Payment } from "@/types";
import HeaderNavBar from "@/components/layout/HeaderNavBar";
import PageHeader from "@/components/layout/PageHeader";
import { useNavigate } from "react-router-dom";
export default function PaymentList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [open, setOpen] = useState(false);

  const loadPayments = async () => {
    const data = await fetchPayments();
    setPayments(data);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Sales Management", href: "/sales/invoices" },
          { label: "Record Payment" },
        ]}
      />
      <PageHeader
        title="Payments"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <PaymentForm
              onSuccess={fetchPayments}
              onClose={() => setOpen(false)}
            />
          </Dialog>
        }
      />
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentsTable payments={payments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
