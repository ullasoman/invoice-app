import { Home, ChevronRight, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItemType[];
}

export default function HeaderNavBar({ breadcrumbs }: PageHeaderProps) {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = localStorage.getItem("auth_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.name) setUserName(parsed.name);
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const initials = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex flex-wrap items-center justify-between py-3 gap-3">
        {/* --- Breadcrumb Section --- */}
        <div className="flex flex-wrap items-center gap-1 min-w-0">
          <Breadcrumb>
            <BreadcrumbList className="flex flex-wrap items-center text-sm text-gray-600">
              <BreadcrumbItem className="truncate max-w-[120px] sm:max-w-none">
                <BreadcrumbLink
                  href="/dashboard"
                  className="flex items-center hover:text-blue-600 whitespace-nowrap"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbs.map((crumb, index) => (
                <div
                  key={index}
                  className="flex items-center whitespace-nowrap truncate max-w-[100px] sm:max-w-none"
                >
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink
                        href={crumb.href}
                        className={`hover:text-blue-600 ${
                          index === breadcrumbs.length - 1
                            ? "font-semibold text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {crumb.label}
                      </span>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* --- User Section --- */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-medium text-gray-800 hidden sm:inline-block truncate max-w-[100px]">
            {userName}
          </span>
          <Avatar className="w-8 h-8 bg-gray-100 border border-gray-300">
            <AvatarFallback className="text-sm font-semibold text-gray-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
