import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, BarChart3, Users, TrendingUpIcon } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Create Estimate",
      subtitle: "Begin estimate",
      icon: <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      border: "border-blue-200 hover:border-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/20",
      textHover: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      link: "/estimates",
    },
    {
      title: "Add Product",
      subtitle: "New inventory",
      icon: <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />,
      border: "border-green-200 hover:border-green-400",
      bg: "bg-green-100 dark:bg-green-900",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/20",
      textHover: "group-hover:text-green-600 dark:group-hover:text-green-400",
      link: "/items/new",
    },
    {
      title: "Add Customer",
      subtitle: "New customer",
      icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      border: "border-purple-200 hover:border-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900",
      hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-950/20",
      textHover: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      link: "/customers",
    },
    {
      title: "View Reports",
      subtitle: "Analytics",
      icon: (
        <TrendingUpIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      ),
      border: "border-orange-200 hover:border-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900",
      hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-950/20",
      textHover: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
      link: "/stock-levels",
    },
  ];

  return (
    <Card className="p-6 bg-white border-border dark:bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className={`group flex items-center gap-4 p-4 rounded-xl border-2 border-dashed ${action.border} ${action.hoverBg} transition-all duration-200`}
          >
            <div
              className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
            >
              {action.icon}
            </div>
            <div>
              <h4
                className={`font-semibold ${action.textHover} transition-colors duration-200`}
              >
                {action.title}
              </h4>
              <p
                className={`text-sm text-muted-foreground ${action.textHover.replace(
                  "font-semibold",
                  ""
                )} transition-colors duration-200`}
              >
                {action.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
