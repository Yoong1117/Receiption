// Route
import ProtectedRoute from "~/components/ProtectedRoute";

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

import { DataTable } from "~/components/receipt_management/data_table";

import {
  createColumns,
  type Receipt,
} from "~/components/receipt_management/column";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import FadeContent from "@/FadeContent/FadeContent";

import { toast } from "sonner";
import React from "react";
import Loading from "~/components/customLoading";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Management" }];
}

export default function ReceiptManagementContent() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (receipt: Receipt) => {
    setReceiptToDelete(receipt);
  };

  const confirmDelete = async () => {
    if (!receiptToDelete) return;
    setLoading(true);

    const { error } = await supabase
      .from("receipts")
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", receiptToDelete.id);

    setLoading(false);

    if (error) {
      toast.error(
        React.createElement(
          "span",
          { className: "text-red-600 font-semibold" },
          "Failed to delete"
        ),
        {
          description: React.createElement(
            "span",
            { className: "text-gray-600" },
            error instanceof Error ? error.message : "Something went wrong."
          ),

          style: {
            border: "1px solid #dc2626", // Tailwind green-600
          },
        }
      );
    } else {
      setReceipts((prev) => prev.filter((r) => r.id !== receiptToDelete.id));
      toast.success(
        React.createElement(
          "span",
          { className: "text-green-600 font-semibold" },
          "Receipt delete successfully"
        ),
        {
          style: {
            border: "1px solid #16a34a", // Tailwind green-600
          },
        }
      );
    }

    setReceiptToDelete(null); // close dialog
  };

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
      setLoading(true);
      setReceipts(mapped);
      setLoading(false);
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
      <>
        <div className="flex h-screen w-full relative text-black">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col h-full relative p-6 overflow-auto">
            {/* Header Row */}
            <div className="flex mb-6 justify-between items-center">
              <div className="flex items-center">
                <SidebarTrigger className="bg-gray-100  hover:bg-[#315098]/50 hover:text-white border border-gray-400 cursor-pointer" />
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
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <FadeContent
                blur={false}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
              >
                <div className="bg-[#E0EDF9] border border-[#A2CBEE] text-center py-6 rounded flex-1 min-w-[300px] max-w-[450px] px-4">
                  <p className="text-lg sm:text-xl">Total Receipt</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {totalReceipts}
                  </p>
                </div>
              </FadeContent>

              <FadeContent
                blur={false}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
                delay={0}
              >
                <div className="bg-[#E0EDF9] border border-[#A2CBEE] text-center py-6 rounded flex-1 min-w-[300px] max-w-[450px] px-4">
                  <p className="text-lg sm:text-xl">Total Amount Spent</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    RM {totalAmount.toFixed(2)}
                  </p>
                </div>
              </FadeContent>
            </div>

            {/* Receipt Table */}
            <div className="bg-transparent rounded flex-1 flex flex-col">
              <DataTable
                columns={createColumns({
                  onDeleteClick: handleDeleteClick,
                  from: "receipt_management",
                })}
                data={receipts}
              />
            </div>
          </div>
        </div>

        {/* Global AlertDialog */}
        <AlertDialog
          open={!!receiptToDelete}
          onOpenChange={() => setReceiptToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black">
                Delete this receipt?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the receipt as deleted. You can still recover it
                later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer text-black border-gray-300"
                onClick={() => setReceiptToDelete(null)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Loading */}
        {loading && <Loading />}
      </>
    </ProtectedRoute>
  );
}
