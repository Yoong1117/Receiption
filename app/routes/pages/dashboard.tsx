// React
import { useEffect, useState } from "react";

// React Router
import type { Route } from "./+types/dashboard";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import AnimatedContent from "@/AnimatedContent/AnimatedContent";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app_sidebar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Auth
import ProtectedRoute from "~/components/ProtectedRoute";
import { userAuth } from "~/context/AuthContext";
import { supabase } from "~/supabase/supabaseClient";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

function DashboardContent() {
  const [ytdTotal, setYtdTotal] = useState<number>(0);
  const [avgPerMonth, setAvgPerMonth] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [highestSpent, setHighestSpent] = useState<{
    amount: number;
    vendor: string;
  }>({ amount: 0, vendor: "" });
  const [topCategory, setTopCategory] = useState<{
    category: string;
    total: number;
  }>({ category: "", total: 0 });

  const now = new Date();
  const currentMonthName = now.toLocaleString("default", { month: "long" }); // e.g., "August"
  const currentYear = now.getFullYear();

  const [topCategories, setTopCategories] = useState<
    { category: string; total: number }[]
  >([]);

  const [monthlyTrend, setMonthlyTrend] = useState<
    { month: string; total: number }[]
  >([]);

  const { userId } = userAuth();

  // Year-to-Date
  useEffect(() => {
    if (!userId) return;

    const fetchYearToDateData = async () => {
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;

      const { data: receiptsData, error } = await supabase
        .from("receipts")
        .select(
          `
          created_at,
          parsed_receipts (
            total_amount
          )
        `
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("created_at", startOfYear);

      if (error) {
        console.error("Error fetching YTD data:", error);
        return;
      }

      const total = (receiptsData ?? []).reduce((sum, r) => {
        const parsed = Array.isArray(r.parsed_receipts)
          ? r.parsed_receipts[0]
          : r.parsed_receipts;
        return sum + (Number(parsed?.total_amount) || 0);
      }, 0);

      setYtdTotal(total);

      const currentMonth = new Date().getMonth() + 1;
      setAvgPerMonth(total / currentMonth);
    };

    fetchYearToDateData();
  }, [userId]);

  // Current Month Summary and Top 5 Spending Categories
  useEffect(() => {
    if (!userId) return;

    const fetchMonthlyData = async () => {
      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

      const { data: receiptsData, error } = await supabase
        .from("receipts")
        .select(
          `
          created_at,
          parsed_receipts (
            total_amount,
            vendor,
            category
          )
        `
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("created_at", startOfMonth);

      if (error) {
        console.error("Error fetching monthly data:", error);
        return;
      }

      let total = 0;
      let highest = { amount: 0, vendor: "" };
      const categoryTotals: Record<string, number> = {};

      (receiptsData ?? []).forEach((r) => {
        const parsed = Array.isArray(r.parsed_receipts)
          ? r.parsed_receipts[0]
          : r.parsed_receipts;
        const amount = Number(parsed?.total_amount) || 0;
        total += amount;

        if (amount > highest.amount) {
          highest = { amount, vendor: parsed?.vendor || "Unknown" };
        }

        if (parsed?.category) {
          categoryTotals[parsed.category] =
            (categoryTotals[parsed.category] || 0) + amount;
        }
      });

      setMonthlyTotal(total);
      setHighestSpent(highest);

      // Find top categories
      const sortedCategories = Object.entries(categoryTotals)
        .map(([category, total]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          total,
        }))
        .sort((a, b) => b.total - a.total);

      setTopCategories(sortedCategories.slice(0, 5)); // Top 5

      // Find top category
      const topCatEntry = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
      )[0];
      if (topCatEntry) {
        setTopCategory({ category: topCatEntry[0], total: topCatEntry[1] });
      }
    };

    fetchMonthlyData();
  }, [userId]);

  // Monthly Expense Trend
  useEffect(() => {
    if (!userId) return;

    const fetchTrendData = async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11); // Go back 11 months (12 months total)

      const { data: receiptsData, error } = await supabase
        .from("receipts")
        .select(
          `
        parsed_receipts (
          total_amount,
          date
        )
      `
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("parsed_receipts.date", startDate.toISOString().split("T")[0]); // <-- filter by parsed_receipts.date

      if (error) {
        console.error("Error fetching monthly trend data:", error);
        return;
      }

      // Aggregate totals per month
      const monthlyTotals: Record<string, number> = {};
      (receiptsData ?? []).forEach((r) => {
        const parsed = Array.isArray(r.parsed_receipts)
          ? r.parsed_receipts[0]
          : r.parsed_receipts;

        const amount = Number(parsed?.total_amount) || 0;
        const date = parsed?.date ? new Date(parsed.date) : null;

        if (!date) return;

        // Format: Jun 25
        const monthKey =
          date.toLocaleString("default", { month: "short" }) +
          " " +
          date.getFullYear().toString().slice(-2);

        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;
      });

      // Ensure all last 12 months are present
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label =
          d.toLocaleString("default", { month: "short" }) +
          " " +
          d.getFullYear().toString().slice(-2);

        months.push({
          month: label,
          total: monthlyTotals[label] || 0,
        });
      }

      setMonthlyTrend(months);
    };

    fetchTrendData();
  }, [userId]);

  return (
    <div className="flex h-screen w-full relative text-black bg-[#F1F7FD]/30">
      {/* Sidebar */}
      <AppSidebar />

      {/* Dashboard Content */}
      <div className="flex flex-1 flex-col h-full relative z-10">
        {/* Header Row */}
        <div className="flex m-6">
          <SidebarTrigger className="bg-white/50 hover:bg-gray-400 hover:text-white border border-gray-400 cursor-pointer" />
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
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={true}
              duration={1.2}
              ease="power3.out"
              animateOpacity
              scale={1.1}
              threshold={0.2}
              delay={0.2}
            >
              <Card className="bg-[#E0EDF9]/90 w-full h-[300px] p-6 border-gray-500">
                <CardHeader>
                  <CardTitle className="text-[28px] font-bold">
                    Year-to-Date: Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[18px]">
                  <label>Year-to-Date Spending: RM {ytdTotal.toFixed(2)}</label>
                  <br />
                  <label>Average Per Month: RM {avgPerMonth.toFixed(2)}</label>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>

          {/* Monthly Expense */}
          <div className="col-span-2 lg:col-span-3">
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={true}
              duration={1.2}
              ease="power3.out"
              animateOpacity
              scale={1.1}
              threshold={0.2}
              delay={0.4}
            >
              <Card className="bg-[#C8DFF5]/90 w-full h-[300px] p-6 border-gray-500">
                <CardHeader>
                  <CardTitle className="text-[28px] font-bold">
                    Expense Summary - {currentMonthName} {currentYear}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[18px]">
                  <label>Total Spent: RM {monthlyTotal.toFixed(2)}</label>
                  <br />
                  <label>
                    Highest Spent: RM {highestSpent.amount.toFixed(2)} @{" "}
                    {highestSpent.vendor}
                  </label>
                  <br />
                  <label>
                    Top Category:{" "}
                    {topCategory.category
                      ? topCategory.category.charAt(0).toUpperCase() +
                        topCategory.category.slice(1) +
                        " "
                      : ""}
                    (RM {topCategory.total.toFixed(2)})
                  </label>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>

          {/* Monthly Expense Trend*/}
          <div className="col-span-2 lg:col-span-3">
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={true}
              duration={1.2}
              ease="power3.out"
              animateOpacity
              scale={1.1}
              threshold={0.2}
              delay={0.6}
            >
              <Card className="bg-[#BADBF7]/90 w-full h-[300px] p-6 border-gray-600 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-[28px] font-bold">
                    Monthly Expense: Trend
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-[18px]">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={monthlyTrend}
                      margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `RM ${value.toFixed(2)}`,
                          "Total",
                        ]}
                        labelFormatter={(label) => `Month: ${label}`}
                        wrapperStyle={{ outline: "none" }}
                        contentStyle={{
                          backgroundColor: "rgba(224, 237, 249)",
                          borderRadius: "6px",
                          width: "140px",
                        }}
                        itemStyle={{
                          fontSize: "14px",
                          padding: 0,
                        }}
                        labelStyle={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      />
                      <Bar
                        dataKey="total"
                        radius={[5, 5, 0, 0]}
                        barSize={25}
                        activeBar={false}
                      >
                        {monthlyTrend.map((entry, index) => {
                          const colors = ["#5591DC", "#4077D0", "#3763BE"];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>

          {/* Top Spending Categories*/}
          <div className="col-span-2">
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={true}
              duration={1.2}
              ease="power3.out"
              animateOpacity
              scale={1.1}
              threshold={0.2}
              delay={0.8}
            >
              <Card className="bg-[#E0EDF9]/90 w-full h-[300px] p-6 border-gray-400">
                <CardHeader>
                  <CardTitle className="text-[28px] font-bold">
                    Top 5 Spending Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[18px]">
                  {topCategories.length > 0 ? (
                    topCategories.map((cat, index) => (
                      <div key={index}>
                        {index + 1}. {cat.category} - RM {cat.total.toFixed(2)}
                      </div>
                    ))
                  ) : (
                    <div>No data available</div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContent>
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
