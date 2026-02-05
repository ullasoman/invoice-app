import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

import BusinessProfileForm from "@/features/settings/components/BusinessProfileForm";
import SalesmanFormDialog from "@/features/settings/components/SalesmanFormDialog";
import SalesmenTable, {
  Salesman,
} from "@/features/settings/components/SalesmenTable";

import {
  fetchBusiness,
  fetchCities,
  fetchSalesmen,
  saveBusiness,
  createSalesman,
  updateSalesman,
  deleteSalesman,
} from "@/features/settings/services/settingsService";
import { CompanyFormData } from "@/features/settings/validation/companySchema";
import { SalesmanFormData } from "@/features/settings/validation/salesmanSchema";
import HeaderNavBar from "@/components/layout/HeaderNavBar";

export default function SettingsPage() {
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  const [businessInfo, setBusinessInfo] = useState<CompanyFormData | null>(
    null
  );
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [loadingSalesmen, setLoadingSalesmen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null);

  useEffect(() => {
    fetchCities().then((res) => setCities(res.data || []));
    loadBusiness();
    loadSalesmen();
  }, []);

  const loadBusiness = async () => {
    try {
      setLoadingCompany(true);
      const { data } = await fetchBusiness();
      setBusinessInfo(Array.isArray(data) ? data : data ?? []);
      return data;
    } finally {
      setLoadingCompany(false);
    }
  };

  const loadSalesmen = async () => {
    try {
      setLoadingSalesmen(true);
      const { data } = await fetchSalesmen();
      setSalesmen(Array.isArray(data) ? data : data?.data ?? []);
    } finally {
      setLoadingSalesmen(false);
    }
  };

  const handleSaveBusiness = async (
    form: CompanyFormData,
    logo?: File | null
  ) => {
    try {
      setSavingCompany(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v as string);
      });
      if (logo) fd.append("logo", logo);
      await saveBusiness(fd);
      toast.success("Business profile updated");
      loadBusiness();
    } catch {
      toast.error("Failed to update business profile");
    } finally {
      setSavingCompany(false);
    }
  };

  const handleSubmitSalesman = async (data: SalesmanFormData) => {
    try {
      if (editingSalesman) {
        await updateSalesman(editingSalesman.id, data);
        toast.success("Salesman updated");
      } else {
        await createSalesman(data);
        toast.success("Salesman created");
      }
      setDialogOpen(false);
      setEditingSalesman(null);
      loadSalesmen();
    } catch {
      toast.error("Failed to save salesman");
    }
  };

  const handleDeleteSalesman = async (id: string | number) => {
    try {
      await deleteSalesman(id);
      toast.success("Salesman deleted");
      loadSalesmen();
    } catch {
      toast.error("Failed to delete salesman");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <HeaderNavBar
        breadcrumbs={[
          { label: "Account Settings", href: "/settings" },
          { label: "Settings" },
        ]}
      />

      <div className="container mx-auto space-y-6">
        {/* Business Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessProfileForm
              initialData={businessInfo} // load and pass if needed
              cities={cities}
              onSubmit={handleSaveBusiness}
              saving={savingCompany}
            />
          </CardContent>
        </Card>

        {/* Salesmen */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Salesmen</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Salesman
            </Button>
          </CardHeader>
          <CardContent>
            <SalesmenTable
              salesmen={salesmen}
              onEdit={(s) => {
                setEditingSalesman(s);
                setDialogOpen(true);
              }}
              onDelete={handleDeleteSalesman}
              loading={loadingSalesmen}
            />
          </CardContent>
        </Card> */}

        <SalesmanFormDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingSalesman(null);
          }}
          onSubmit={handleSubmitSalesman}
          initialValues={editingSalesman}
        />
      </div>
    </div>
  );
}
