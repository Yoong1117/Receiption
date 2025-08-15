// React
import React, { useState } from "react";

// React router
import { useNavigate } from "react-router";
import { toast } from "sonner";

// Supabase
import { supabase } from "~/supabase/supabaseClient";

export function useReceiptEdit(receiptId?: string) {
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [remark, setRemark] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const navigate = useNavigate();

  // Uploads receipt and parsed data to Supabase
  async function update() {
    const canUpload = vendor && amount && selectedPayment && selectedCategory;

    if (!canUpload) {
      throw new Error("Missing required fields");
    }

    try {
      // Get the parsed_receipts row for this receipt
      const { data: parsedRows, error: fetchError } = await supabase
        .from("parsed_receipts")
        .select("id")
        .eq("receipt_id", receiptId)
        .single();

      if (fetchError) throw fetchError;

      const parsedReceiptId = parsedRows.id;

      // Update parsed_receipts table
      const { error: updateError } = await supabase
        .from("parsed_receipts")
        .update({
          vendor,
          total_amount: parseFloat(amount),
          date,
          payment_method: selectedPayment,
          category: selectedCategory,
          remark,
        })
        .eq("id", parsedReceiptId);

      if (updateError) throw updateError;

      const formatCapitalize = (str: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

      toast.success(
        React.createElement(
          "span",
          { className: "text-green-600 font-semibold" },
          "Receipt updated successfully!"
        ),
        {
          description: React.createElement(
            "div",
            { className: "text-gray-600 space-y-1" },
            [
              React.createElement(
                "div",
                { key: "vendor" },
                `Vendor: ${vendor}`
              ),
              React.createElement("div", { key: "date" }, `Date: ${date}`),
              React.createElement(
                "div",
                { key: "amount" },
                `Amount: RM${amount}`
              ),
              React.createElement(
                "div",
                { key: "payment" },
                `Payment: ${formatCapitalize(selectedPayment)}`
              ),
              React.createElement(
                "div",
                { key: "category" },
                `Category: ${formatCapitalize(selectedCategory)}`
              ),
              React.createElement(
                "div",
                { key: "remark" },
                `Remark: ${remark}`
              ),
            ]
          ),

          style: {
            border: "2px solid #16a34a", // Tailwind green-600
          },
        }
      );

      navigate("/receipt_management");
    } catch (err) {
      toast.error(
        React.createElement(
          "span",
          { className: "text-red-600 font-semibold" },
          "Upload failed"
        ),
        {
          description: React.createElement(
            "span",
            { className: "text-gray-600" },
            err instanceof Error ? err.message : "Something went wrong."
          ),

          style: {
            border: "2px solid #dc2626", // Tailwind green-600
          },
        }
      );
      console.error("Error updating receipt:", err);
    }
  }

  return {
    // State
    vendor,
    date,
    amount,
    selectedCategory,
    selectedPayment,
    remark,
    paymentOpen,
    categoryOpen,
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
  };
}
