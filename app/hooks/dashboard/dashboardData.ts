// React
import { useEffect, useState } from "react";

// Auth
import { userAuth } from "~/context/AuthContext";

// Supabase client
import { supabase } from "~/supabase/supabaseClient";

export default function useDashboardData() {
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

  const [topCategories, setTopCategories] = useState<
    { category: string; total: number }[]
  >([]);

  const [monthlyTrend, setMonthlyTrend] = useState<
    { month: string; total: number }[]
  >([]);

  const { userId } = userAuth();

  useEffect(() => {
    if (!userId) return;

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchYearToDateData(),
          fetchMonthlyData(),
          fetchTrendData(),
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    // Year to Date
    const fetchYearToDateData = async () => {
      // From beginning of the year to current year
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;

      const { data: receiptsData, error } = await supabase
        .from("receipts")
        .select(
          `created_at,
           parsed_receipts ( total_amount )`
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("created_at", startOfYear);

      if (error) throw error;

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

    // Statistic for this month
    const fetchMonthlyData = async () => {
      // From the beginning of this month to current day
      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-01`;

      const { data: receiptsData, error } = await supabase
        .from("receipts")
        .select(
          `created_at,
           parsed_receipts ( total_amount, vendor, category )`
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("created_at", startOfMonth);

      if (error) throw error;

      let total = 0;
      let highest = { amount: 0, vendor: "" };
      const categoryTotals: Record<string, number> = {};

      (receiptsData ?? []).forEach((r) => {
        const parsed = Array.isArray(r.parsed_receipts)
          ? r.parsed_receipts[0]
          : r.parsed_receipts;
        const amount = Number(parsed?.total_amount) || 0;
        // Sum up to get total
        total += amount;

        // Compare all amount and get the highest
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

      // Sort in descending order
      const sortedCategories = Object.entries(categoryTotals)
        .map(([category, total]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          total,
        }))
        .sort((a, b) => b.total - a.total);

      // Set top 3 categories
      setTopCategories(sortedCategories.slice(0, 3));

      const topCatEntry = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
      )[0];
      if (topCatEntry) {
        setTopCategory({ category: topCatEntry[0], total: topCatEntry[1] });
      }
    };

    // Trend data
    const fetchTrendData = async () => {
      const startDate = new Date();

      // Start month
      startDate.setMonth(startDate.getMonth() - 11);

      const { data: receiptsData, error } = await supabase
        .from("receipts")
        .select(`parsed_receipts ( total_amount, date )`)
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("parsed_receipts.date", startDate.toISOString().split("T")[0]);

      if (error) throw error;

      const monthlyTotals: Record<string, number> = {};

      (receiptsData ?? []).forEach((r) => {
        const parsed = Array.isArray(r.parsed_receipts)
          ? r.parsed_receipts[0]
          : r.parsed_receipts;

        // Get amount and date
        const amount = Number(parsed?.total_amount) || 0;
        const date = parsed?.date ? new Date(parsed.date) : null;
        if (!date) return;

        // Differentiate month
        const monthKey =
          date.toLocaleString("default", { month: "short" }) +
          " " +
          date.getFullYear().toString().slice(-2);

        // Amount for each month
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;
      });

      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);

        // Year label: e.g. Feb 25
        const label =
          d.toLocaleString("default", { month: "short" }) +
          " " +
          d.getFullYear().toString().slice(-2);

        // Month label and amount
        months.push({
          month: label,
          total: monthlyTotals[label] || 0,
        });
      }

      setMonthlyTrend(months);
    };

    fetchAllData();
  }, [userId]);

  return {
    ytdTotal,
    avgPerMonth,
    monthlyTotal,
    highestSpent,
    topCategory,
    topCategories,
    monthlyTrend,
  };
}
