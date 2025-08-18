// Route
import type { Route } from "./+types/receipt_deleted";
import ProtectedRoute from "~/components/ProtectedRoute";

// Supabase
import { supabase } from "~/supabase/supabaseClient";

// React
import { useEffect, useState } from "react";

// UI components
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

import { toast } from "sonner";
import React from "react";
import Loading from "~/components/customLoading";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Deleted" }];
}

export default function ReceiptDelete() {
  const [userId, setUserId] = useState<string | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [receiptToRestore, setReceiptToRestore] = useState<Receipt | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleRestoreClick = (receipt: Receipt) => {
    setReceiptToRestore(receipt);
  };

  const restoreReceipt = async () => {
    if (!receiptToRestore) return;

    setLoading(true);

    const { error } = await supabase
      .from("receipts")
      .update({
        is_active: true,
        deleted_at: null,
      })
      .eq("id", receiptToRestore.id);

    setLoading(false);

    if (error) {
      toast.error(
        React.createElement(
          "span",
          { className: "text-red-600 font-semibold" },
          "Failed to restore"
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
      setReceipts((prev) => prev.filter((r) => r.id !== receiptToRestore.id));
      toast.success(
        React.createElement(
          "span",
          { className: "text-green-600 font-semibold" },
          "Receipt restore successfully"
        ),
        {
          style: {
            border: "1px solid #16a34a", // Tailwind green-600
          },
        }
      );
    }

    setReceiptToRestore(null); // close dialog
  };

  const handleDeleteClick = (receipt: Receipt) => {
    setReceiptToDelete(receipt);
  };

  const deleteReceipt = async () => {
    if (!receiptToDelete) return;

    setLoading(true);

    try {
      // 1. Fetch the image_url before deleting
      const { data: receiptData, error: fetchError } = await supabase
        .from("receipts")
        .select("image_url")
        .eq("id", receiptToDelete.id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Delete related parsed_receipts first (foreign key dependency)
      const { error: parsedError } = await supabase
        .from("parsed_receipts")
        .delete()
        .eq("receipt_id", receiptToDelete.id);

      if (parsedError) throw parsedError;

      // 3. Delete the receipt row
      const { error: receiptError } = await supabase
        .from("receipts")
        .delete()
        .eq("id", receiptToDelete.id);

      if (receiptError) throw receiptError;

      // 4. Delete the image from Supabase storage (if exists)
      if (receiptData?.image_url) {
        // convert public URL back to file path
        const filePath = receiptData.image_url.split(
          "/storage/v1/object/public/receipts/"
        )[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("receipts")
            .remove([filePath]);

          if (storageError) throw storageError;
        }
      }

      setLoading(false);

      // 5. Update state
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
    } catch (error) {
      toast.error(
        React.createElement(
          "span",
          { className: "text-red-600 font-semibold" },
          "Delete failed"
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
        .eq("is_active", false)
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
                  <h1 className="text-lg font-semibold">Deleted Receipts</h1>
                </div>
              </div>
            </div>

            {/* Receipt Table */}
            <div className="bg-transparent rounded flex-1 flex flex-col">
              <DataTable
                columns={createColumns({
                  onDeleteClick: handleDeleteClick,
                  onRestoreClick: handleRestoreClick,
                  from: "receipt_deleted",
                })}
                data={receipts}
              />
            </div>
          </div>

          {/* Global AlertDialog */}
          <AlertDialog
            open={!!receiptToRestore}
            onOpenChange={() => setReceiptToRestore(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black">
                  Restore this receipt?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will restore the receipt, and you will be able to view
                  this receipt in receipt management page.
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
                  className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                  onClick={restoreReceipt}
                >
                  Restore
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                  This will permenantly delete this receipt. You would not able
                  to restore it back.
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
                  onClick={deleteReceipt}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Loading */}
        {loading && <Loading />}
      </>
    </ProtectedRoute>
  );
}
