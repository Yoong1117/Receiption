// React
import React, { useState, useEffect } from "react";

// React router
import { useNavigate } from "react-router";

// Supabase client
import { supabase } from "~/supabase/supabaseClient";

// Receipt parsing using regex
import {
  preprocess,
  extractVendor,
  extractDate,
  extractTotal,
  extractCategory,
  extractPaymentMethod,
} from "~/utils/receiptParsing";

// Upload receipt
import {
  uploadImage,
  insertReceipt,
  insertParsedReceipt,
} from "~/routes/api/receipt_upload/receipts";

// UI components
import { toast } from "sonner";

// OCR call
async function runOCR(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("../api/ocr", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json(); // { rawText: string }
}

export function useReceiptUpload() {
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [remark, setRemark] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Handles selecting a file via input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      processFile(uploadedFile);
    }
    setShowDropzone(false);
  };

  // Handles dropping a file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
    setShowDropzone(false);
  };

  // Processes the file: sets state, runs OCR, parses text
  async function processFile(uploadedFile: File) {
    setFile(uploadedFile);
    setHasUploaded(false);

    const { rawText } = await runOCR(uploadedFile);
    setRawText(rawText);

    const text = preprocess(rawText);

    setVendor(extractVendor(text) || "");
    setDate(extractDate(text) || "");
    setAmount(extractTotal(text)?.toString() || "");
    setSelectedCategory(extractCategory(text) || "");
    setSelectedPayment(extractPaymentMethod(text) || "");
  }

  // Uploads receipt and parsed data to Supabase
  async function upload() {
    const canUpload =
      file &&
      rawText &&
      vendor &&
      amount &&
      selectedPayment &&
      selectedCategory &&
      userId &&
      !hasUploaded;

    if (!canUpload) {
      throw new Error("Missing required fields or already uploaded.");
    }

    setHasUploaded(true);

    try {
      const imageUrl = await uploadImage(file!, userId!);
      const receiptId = await insertReceipt(userId!, imageUrl, rawText);

      await insertParsedReceipt(
        receiptId,
        vendor,
        amount,
        date,
        selectedPayment,
        selectedCategory,
        remark
      );

      navigate("/receipt_management");

      toast.success(
        React.createElement(
          "span",
          { className: "text-green-600 font-semibold" },
          "Receipt added successfully!"
        ),
        {
          description: React.createElement(
            "span",
            { className: "text-gray-600" },
            `Vendor: ${vendor} — Date: ${date} — Amount: RM${amount}`
          ),

          style: {
            border: "2px solid #16a34a", // Tailwind green-600
          },
        }
      );
    } catch (error) {
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
            error instanceof Error ? error.message : "Something went wrong."
          ),

          style: {
            border: "2px solid #dc2626", // Tailwind green-600
          },
        }
      );
    }
  }
  return {
    // State
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
    // Handlers
    handleFileSelect,
    handleDrop,
    processFile,
    upload,
  };
}
