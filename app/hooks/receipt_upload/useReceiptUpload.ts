import { useState, useEffect } from "react";
import { supabase } from "~/supabase/supabaseClient";
import {
  preprocess,
  extractVendor,
  extractDate,
  extractTotal,
  extractCategory,
  extractPaymentMethod,
} from "~/utils/receiptParsing";
import {
  uploadImage,
  insertReceipt,
  insertParsedReceipt,
} from "~/routes/api/receipt_upload/receipts";

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
