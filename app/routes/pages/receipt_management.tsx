// Supabase
import { supabase } from "~/supabase/supabaseClient";

// React
import { useEffect, useState } from "react";

// React router
import { useNavigate } from "react-router";
import type { Route } from "./+types/receipt_management";

// UI components
import { Button } from "~/components/ui/button";
import { AppSidebar } from "~/components/app_sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";

import ProtectedRoute from "~/components/ProtectedRoute";
import { DataTable } from "~/components/receipt_management/data_table";
import { columns, type Receipt } from "~/components/receipt_management/column";

// React
import FadeContent from "@/FadeContent/FadeContent";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Management" }];
}

export default function ReceiptManagementContent() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchReceipts = async () => {
      const { data: receiptsData, error: receiptsError } = await supabase
        .from("receipts")
        .select(
          `
          id,
          created_at,
          parsed_receipts (
            vendor,
            total_amount,
            date,
            payment_method,
            category
          )
        `
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (receiptsError) throw receiptsError;

      const mapped: Receipt[] = (receiptsData ?? []).map((r) => {
        const parsed = Array.isArray(r.parsed_receipts)
          ? r.parsed_receipts[0]
          : r.parsed_receipts;
        return {
          id: r.id,
          vendor: parsed?.vendor ?? "Unknown",
          payment: parsed?.payment_method ?? "Unknown",
          category: parsed?.category ?? "Uncategorized",
          amount: parsed?.total_amount?.toString() ?? "0.00",
          date: parsed?.date ?? "",
          upload: r.created_at?.split("T")[0] ?? "",
        };
      });

      setReceipts(mapped);
    };

    fetchReceipts();
  }, [userId]);

  // Compute totals
  const totalReceipts = receipts.length;
  const totalAmount = receipts.reduce(
    (sum, r) => sum + parseFloat(r.amount || "0"),
    0
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full relative text-black">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full relative p-6 overflow-auto">
          {/* Header Row */}
          <div className="flex mb-6 justify-between items-center">
            <div className="flex items-center">
              <SidebarTrigger className="bg-gray-100 hover:bg-gray-400 hover:text-white border border-gray-400 cursor-pointer" />
              <div className="pl-4">
                <h1 className="text-lg font-semibold">
                  Receipt Management - Overview
                </h1>
              </div>
            </div>
            <Button
              className="cursor-pointer bg-[#4077D0] hover:bg-[#3763BE]"
              onClick={() => navigate("/receipt_upload")}
            >
              Upload Receipt
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-nowrap justify-center gap-6 mb-6">
            <FadeContent
              blur={false}
              duration={1000}
              easing="ease-out"
              initialOpacity={0}
            >
              <div className="bg-[#E0EDF9] border border-[#A2CBEE] text-center py-6 mx-6 rounded w-[190px] sm:w-[260px] md:w-[330px] lg:w-[450px]">
                <p className="text-xl">Total Receipt</p>
                <p className="text-2xl font-bold">{totalReceipts}</p>
              </div>
            </FadeContent>

            <FadeContent
              blur={false}
              duration={1000}
              easing="ease-out"
              initialOpacity={0}
              delay={0}
            >
              <div className="bg-[#E0EDF9] border border-[#A2CBEE] text-center py-6 mx-6 rounded w-[190px] sm:w-[260px] md:w-[330px] lg:w-[450px]">
                <p className="text-xl">Total Amount Spent</p>
                <p className="text-2xl font-bold">
                  RM {totalAmount.toFixed(2)}
                </p>
              </div>
            </FadeContent>
          </div>

          {/* Receipt Table */}
          <div className="bg-transparent rounded flex-1 flex flex-col">
            <DataTable columns={columns} data={receipts} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
