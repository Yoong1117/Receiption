import ReceiptPreview from "~/components/receipt_upload/ReceiptPreview";
import ReceiptDetailsForm from "~/components/receipt_upload/ReceiptDetails";
import ProtectedRoute from "~/components/ProtectedRoute";
import { AppSidebar } from "~/components/app_sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { useReceiptEdit } from "~/hooks/receipt_edit/editReceipt";
import { supabase } from "~/supabase/supabaseClient";
import { useEffect, useState } from "react";
import type { Route } from "./+types/receipt_edit";
import type { ClientLoaderFunctionArgs } from "react-router";
import Loading from "~/components/customLoading";

// Loader
export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const receiptId = params.id;
  const [categoriesResult, paymentsResult, receiptData] = await Promise.all([
    supabase
      .from("categories")
      .select("id, label")
      .order("sort_order", { ascending: true }),
    supabase
      .from("payment_methods")
      .select("id, label")
      .order("sort_order", { ascending: true }),
    supabase
      .from("receipts")
      .select(
        "id, image_url, parsed_receipts (vendor, total_amount, date, payment_method, category, remark)"
      )
      .eq("id", receiptId),
  ]);

  if (receiptData)
    if (categoriesResult.error || paymentsResult.error || receiptData.error) {
      return {
        error:
          categoriesResult.error ?? paymentsResult.error ?? receiptData.error,
      };
    }

  return {
    categories: categoriesResult.data,
    paymentMethods: paymentsResult.data,
    receiptData: receiptData.data,
  };
}

export default function receipt_edit({ loaderData }: Route.ComponentProps) {
  const { categories, paymentMethods, receiptData } = loaderData;
  const [initialData, setInitialData] = useState<Boolean>(false);

  const {
    // States
    vendor,
    date,
    amount,
    selectedCategory,
    selectedPayment,
    remark,
    paymentOpen,
    categoryOpen,
    loading,
    // Setters
    setVendor,
    setDate,
    setAmount,
    setSelectedCategory,
    setSelectedPayment,
    setRemark,
    setPaymentOpen,
    setCategoryOpen,
    update,
  } = useReceiptEdit(receiptData?.[0]?.id);

  useEffect(() => {
    if (!receiptData?.[0]?.parsed_receipts) return;

    if (!initialData) {
      const parsed = Array.isArray(receiptData[0].parsed_receipts)
        ? receiptData[0].parsed_receipts[0]
        : receiptData[0].parsed_receipts;

      setVendor(parsed?.vendor || "");
      setDate(parsed?.date || "");
      setAmount(parsed?.total_amount?.toString() || "");

      // Match payment method label to its ID
      const paymentMatch = paymentMethods?.find(
        (p) =>
          p.id === parsed.payment_method ||
          p.label.toLowerCase() === parsed.payment_method?.toLowerCase()
      );
      setSelectedPayment(paymentMatch?.id || "");

      // Match category label to its ID
      const categoryMatch = categories?.find(
        (c) =>
          c.id === parsed.category ||
          c.label.toLowerCase() === parsed.category?.toLowerCase()
      );
      setSelectedCategory(categoryMatch?.id || "");

      setRemark(parsed.remark || "");
      setInitialData(true);
    }
  });

  return (
    <>
      {" "}
      <ProtectedRoute>
        <>
          <div className="flex h-screen w-full overflow-hidden relative text-black">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col relative z-10">
              {/* Header */}
              <div className="flex m-6">
                <SidebarTrigger className="bg-gray-100  hover:bg-[#315098]/50 hover:text-white border border-gray-400 cursor-pointer" />
                <div className="justify-center items-center pl-4">
                  <h1 className="text-lg font-semibold">
                    Receipt Management - Edit
                  </h1>
                </div>
              </div>

              <main className="flex flex-1 justify-center p-6 pt-0">
                <div className="flex flex-1 rounded-lg shadow border border-gray-400">
                  {/* Receipt Preview */}
                  <ReceiptPreview
                    from="receipt_edit"
                    imageUrl={receiptData?.[0]?.image_url ?? ""}
                  />

                  {/* Receipt Details */}
                  <ReceiptDetailsForm
                    from="receipt_edit"
                    vendor={vendor}
                    date={date}
                    amount={amount}
                    selectedPayment={selectedPayment}
                    selectedCategory={selectedCategory}
                    remark={remark}
                    paymentMethods={paymentMethods ?? []}
                    categories={categories ?? []}
                    paymentOpen={paymentOpen}
                    categoryOpen={categoryOpen}
                    setVendor={setVendor}
                    setDate={setDate}
                    setAmount={setAmount}
                    setSelectedPayment={setSelectedPayment}
                    setSelectedCategory={setSelectedCategory}
                    setRemark={setRemark}
                    setPaymentOpen={setPaymentOpen}
                    setCategoryOpen={setCategoryOpen}
                    onSubmit={update}
                  />
                </div>
              </main>
            </div>
          </div>

          {/* Loading */}
          {loading && <Loading />}
        </>
      </ProtectedRoute>
    </>
  );
}
