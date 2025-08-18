// React Router
import type { Route } from "./+types/receipt_upload";

// Supabase
import { supabase } from "~/supabase/supabaseClient";

// UI Components
import ProtectedRoute from "~/components/ProtectedRoute";
import { AppSidebar } from "~/components/app_sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";

import ReceiptPreview from "~/components/receipt_upload/ReceiptPreview";
import DropzoneModal from "~/components/receipt_upload/DropzoneModal";
import ReceiptDetailsForm from "~/components/receipt_upload/ReceiptDetails";

// Receipt upload
import { useReceiptUpload } from "~/hooks/receipt_upload/uploadReceipt";
import Loading from "~/components/customLoading";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Upload" }];
}

// Loader
export async function loader() {
  const [categoriesResult, paymentsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, label")
      .order("sort_order", { ascending: true }),
    supabase
      .from("payment_methods")
      .select("id, label")
      .order("sort_order", { ascending: true }),
  ]);

  // Handle errors
  if (categoriesResult.error || paymentsResult.error) {
    return {
      error: categoriesResult.error ?? paymentsResult.error,
    };
  }

  return {
    categories: categoriesResult.data,
    paymentMethods: paymentsResult.data,
  };
}

export default function UploadReceiptContent({
  loaderData,
}: Route.ComponentProps) {
  const { categories, paymentMethods } = loaderData;

  const {
    // States
    file,
    vendor,
    date,
    amount,
    selectedCategory,
    selectedPayment,
    remark,
    paymentOpen,
    categoryOpen,
    showDropzone,
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
    setShowDropzone,
    // Handler
    handleFileSelect,
    handleDrop,
    upload, // renamed from `handleUpload` in your old code
  } = useReceiptUpload();

  return (
    <>
      {" "}
      <ProtectedRoute>
        <div className="flex h-screen w-full relative text-black">
          {/* Sidebar */}
          <AppSidebar />
          {/* Main Content */}
          <div className="flex flex-1 flex-col relative z-10">
            {/* Header */}
            <div className="flex m-6">
              <SidebarTrigger className="bg-gray-100 hover:bg-[#315098]/50 hover:text-white border border-gray-400 cursor-pointer" />
              <div className="justify-center items-center pl-4">
                <h1 className="text-lg font-semibold">Upload Receipt</h1>
              </div>
            </div>

            <main className="flex flex-1 justify-center p-6 pt-0">
              <div className="flex flex-1 rounded-lg shadow border border-gray-400">
                {/* Receipt Preview */}
                <ReceiptPreview
                  from="receipt_upload"
                  file={file}
                  onUploadClick={() => setShowDropzone(true)}
                />

                {/* Dropzone Modal */}
                {showDropzone && (
                  <DropzoneModal
                    onDrop={handleDrop}
                    onFileSelect={handleFileSelect}
                    onCancel={() => setShowDropzone(false)}
                  />
                )}

                {/* Receipt Details */}
                <ReceiptDetailsForm
                  from="receipt_upload"
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
                  onSubmit={upload}
                />
              </div>
            </main>
          </div>
          {/* Loading */}
          {loading && <Loading />}
        </div>
      </ProtectedRoute>
    </>
  );
}
