// React Router
import type { Route } from "./+types/dashboard";

// UI components
import { SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app_sidebar";

// Auth
import ProtectedRoute from "~/components/ProtectedRoute";

//
import useDashboardData from "~/hooks/dashboard/dashboardData";
import YtdSummaryCard from "~/components/dashboard/YtdSummaryCard";
import MonthlySummaryCard from "~/components/dashboard/MonthlySummaryCard";
import MonthlyExpenseTrend from "~/components/dashboard/MonthlyExpenseTrend";
import TopSpendingCategories from "~/components/dashboard/TopSpendingCategories";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

function DashboardContent() {
  const {
    ytdTotal,
    avgPerMonth,
    monthlyTotal,
    highestSpent,
    topCategory,
    topCategories,
    monthlyTrend,
  } = useDashboardData();

  return (
    <div className="flex h-screen w-full relative text-black bg-[#F1F7FD]/30">
      {/* Sidebar */}
      <AppSidebar />

      {/* Dashboard Content */}
      <div className="flex flex-1 flex-col h-full relative z-10">
        {/* Header Row */}
        <div className="flex m-6">
          <SidebarTrigger className="bg-gray-100  hover:bg-[#315098]/50 hover:text-white border border-gray-400 cursor-pointer" />
          <div className="justify-center items-center pl-4">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </div>

        {/* Dashboard Content */}
        <main
          className="flex-1 w-full pl-6 pr-8 grid gap-8
                 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 min-h-0 "
        >
          {/* Year-to-Date */}
          <div className="col-span-2">
            <YtdSummaryCard
              total={ytdTotal}
              avg={avgPerMonth}
            ></YtdSummaryCard>{" "}
          </div>

          {/* Monthly Expense */}
          <div className="col-span-2 lg:col-span-3">
            <MonthlySummaryCard
              monthTotal={monthlyTotal}
              spent={highestSpent}
              topCat={topCategory}
            />
          </div>

          {/* Monthly Expense Trend*/}
          <div className="col-span-2 lg:col-span-3 pb-8 ">
            <MonthlyExpenseTrend trend={monthlyTrend} />
          </div>

          {/* Top Spending Categories*/}
          <div className="col-span-2 pb-8">
            <TopSpendingCategories categories={topCategories} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
