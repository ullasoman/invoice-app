import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardPage from "@/pages/DashboardPage";
// import CategoriesPage from "@/pages/categories/CategoriesPage";
// import PaymentPage from "@/pages/payments/PaymentPage";
// import StockLevelPage from "@/pages/stock/StockLevelPage";
// import SettingsPage from "@/pages/settings/SettingsPage";


// import ItemListPage from "@/pages/items/ItemListPage";
// import ItemCreatePage from "@/pages/items/ItemCreatePage";
// import ItemViewPage from "@/pages/items/ItemViewPage";
// import ItemEditPage from "@/pages/items/ItemEditPage";

// import SupplierPage from "@/pages/dashboard/SuppliersPage";

// import PurchaseListPage from "@/pages/dashboard/purchases/PurchaseListPage";
// import PurchaseEntryPage from "@/pages/dashboard/purchases/PurchaseEntryPage";
// import PurchaseViewPage from "@/pages/dashboard/purchases/PurchaseViewPage";

// import InvoiceListPage from "@/pages/invoices/InvoiceListPage";
// import InvoiceCreatePage from "@/pages/invoices/InvoiceCreatePage";
// import InvoiceDetailsPage from "@/pages/invoices/InvoiceDetailsPage";

// import EstimateListPage from "@/pages/dashboard/estimates/EstimateListPage";
// import EstimateCreatePage from "@/pages/dashboard/estimates/EstimateCreatePage";
// import EstimateViewPage from "@/pages/dashboard/estimates/EstimateViewPage";
// import EstimateEditPage from "@/pages/dashboard/estimates/EstimateEditPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import BuyersPage from "@/pages/BuyersPage";
import SuppliersPage from "@/pages/SuppliersPage";
import ItemsPage from "@/pages/items/ItemsPage";
import ItemCreatePage from "@/pages/items/ItemCreatePage";
import ItemViewPage from "@/pages/items/ItemViewPage";
import ItemEditPage from "@/pages/items/ItemEditPage";
import CategoriesPage from "@/pages/CategoriesPage";
import EstimateListPage from "@/pages/estimates/EstimateList";
import EstimateCreatePage from "@/pages/estimates/EstimateCreate";
import EstimateViewPage from "@/pages/estimates/EstimateView";
import EstimateEditPage from "@/pages/estimates/EstimateEdit";
import { PaymentList } from "@/features/payments";
import StockLevelPage from "@/pages/stock/StockLevelPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import PurchaseListPage from "@/pages/purchases/PurchaseListPage";
import PurchaseEntryPage from "@/pages/purchases/PurchaseEntryPage";
import PurchaseViewPage from "@/pages/purchases/PurchaseViewPage";
import PurchaseEditPage from "@/pages/purchases/PurchaseEditPage";
import SalesInvoiceListPage from "@/pages/sales/invoices/SalesInvoiceListPage";
import SalesInvoiceCreatePage from "@/pages/sales/invoices/SalesInvoiceCreatePage";
import SalesInvoiceDetailsPage from "@/pages/sales/invoices/SalesInvoiceDetailsPage";
import SalesInvoiceEditPage from "@/pages/sales/invoices/SalesInvoiceEditPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          {/* Items */}
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/new" element={<ItemCreatePage />} />
          <Route path="/items/edit/:id" element={<ItemEditPage />} />
          <Route path="/items/view/:id" element={<ItemViewPage />} />

          {/* Suppliers */}
          <Route path="/suppliers" element={<SuppliersPage />} />

          {/* Purchases */}
          <Route path="/purchases" element={<PurchaseListPage />} />
          <Route path="/purchases/new" element={<PurchaseEntryPage />} />
          <Route path="/purchases/view/:id" element={<PurchaseViewPage />} />
          <Route path="/purchases/edit/:id" element={<PurchaseEditPage />} />

          {/* Buyers */}
          <Route path="/customers" element={<BuyersPage />} />

          {/* Invoices */}
          <Route path="/sales/invoices" element={<SalesInvoiceListPage />} />
          <Route
            path="/sales/invoices/new"
            element={<SalesInvoiceCreatePage />}
          />
          <Route
            path="/sales/invoices/view/:id"
            element={<SalesInvoiceDetailsPage />}
          />
          <Route
            path="/sales/invoices/edit/:id"
            element={<SalesInvoiceEditPage />}
          />

          {/* Estimates */}
          <Route path="/estimates" element={<EstimateListPage />} />
          <Route path="/estimates/new" element={<EstimateCreatePage />} />
          <Route path="/estimates/:id" element={<EstimateViewPage />} />
          <Route path="/estimates/edit/:id" element={<EstimateEditPage />} />

          {/* Other */}

          <Route path="/payments" element={<PaymentList />} />
          <Route path="/stock-levels" element={<StockLevelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
