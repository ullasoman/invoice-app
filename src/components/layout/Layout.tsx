import { ReactNode, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Receipt,
  BarChart3,
  Building2,
  Menu,
  X,
  LogOut,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import apiClient from "@/shared/api/api";
import api from "@/shared/api/api";
import { clearAuth } from "@/shared/api/token";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children?: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: Package },
  { name: "Items", href: "/items", icon: Package },
  { name: "Suppliers", href: "/suppliers", icon: Users },
  { name: "Purchases", href: "/purchases", icon: Receipt },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Invoices", href: "/sales/invoices", icon: Receipt },
  { name: "Estimates", href: "/estimates", icon: Calculator },
  { name: "Payments", href: "/payments", icon: Receipt },
  { name: "Stock Levels", href: "/stock-levels", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.post("/logout").catch(() => {});
    } finally {
      clearAuth();
      navigate("/", { replace: true });
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:w-64 xxl:w-72 bg-[#071e30] shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <img src="/images/icon-white.png" alt="fatorah logo" />
              </div>
              <h1 className="text-xl font-bold text-white">Fatorah</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    active
                      ? "bg-primary/90 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-gray-800 text-white border-gray-700 hover:bg-primary"
                  disabled={loggingOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You’ll need to sign in
                    again to access the dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loggingOut}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Content area with correct padding for each breakpoint */}
      <div className="lg:pl-64 xxl:pl-72 transition-all duration-300">
        {/* Topbar for mobile */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">UAE Invoice System</h1>
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 min-h-screen">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
}
