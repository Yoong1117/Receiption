import React, { useState, useRef } from "react";

// UI Components
import ProtectedRoute from "~/components/ProtectedRoute";
import { AppSidebar } from "~/components/app_sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";

const categories = [
  {
    value: "food",
    label: "Food",
  },
  {
    value: "transport",
    label: "Transport",
  },
  {
    value: "travel",
    label: "Travel",
  },
  {
    value: "utilities",
    label: "Utilities",
  },
];

function UploadReceiptContent() {
  const [file, setFile] = useState<File | null>(null);
  const [vendor, setVendor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");

  const [open, setOpen] = React.useState(false);

  const [showDropzone, setShowDropzone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      console.log("Selected file:", uploadedFile);

      // Trigger OCR automatically
      runOCR(uploadedFile);
    }
    setShowDropzone(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      const uploadedFile = files[0];
      setFile(uploadedFile);

      // Trigger OCR automatically
      runOCR(uploadedFile);
    }
    setShowDropzone(false);
  };

  const runOCR = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { rawText } = await response.json();
      console.log("OCR Result:", rawText);

      const parsed = parseReceipt(rawText);

      if (parsed.vendor) setVendor(parsed.vendor);
      if (parsed.date) setDate(formatDate(parsed.date)); // convert dd/mm/yyyy to yyyy-mm-dd
      if (parsed.total) setAmount(parsed.total.toString());

      console.log(
        "Parsed Result: ",
        parsed.vendor,
        " Date: ",
        parsed.date,
        "Total: ",
        parsed.total
      );
    } catch (error) {
      console.error("OCR failed:", error);
    }
  };

  // Remove symbols
  //function cleanText(text: string) {
  //  return (
  //    text
  // \s: any whitespace character
  // +: one or more occurences
  // g: global flag, replace all matches

  // \x20 → space character (ASCII 32)
  // \x7E → ~ character (ASCII 126)
  // [^\x20-\x7E] → matches any character NOT in the printable ASCII range
  // g → remove all occurrences
  //      .replace(/\s+/g, " ")
  //      .replace(/[^\x20-\x7E]/g, "")
  //      .trim()
  //  );
  //}

  function preprocess(text: string) {
    return text
      .replace(/\r/g, "")
      .replace(/[^\x20-\x7E\n]/g, "") // keep only readable ASCII & line breaks
      .replace(/\n{2,}/g, "\n") // merge multiple line breaks
      .trim();
  }

  function extractVendor(text: string) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const blacklist = [
      "welcome",
      "invoice",
      "receipt",
      "thank",
      "sales",
      "pos",
      "staff",
    ];
    const firstFew = lines.slice(0, 6);

    for (const line of firstFew) {
      if (!blacklist.some((word) => line.toLowerCase().includes(word))) {
        return line; // first non-generic line
      }
    }
    return null;
  }

  function parseReceipt(ocrText: string) {
    const text = preprocess(ocrText);

    const dateMatch = text.match(
      /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})(?:\s+(\d{1,2}:\d{2}))?/
    );

    const totalMatch = text.match(
      /(?:TOTAL|Amount|Grand\s*Total)[^\d]*(\d+\.\d{2})/i
    );

    const amountRegex = /\d+\.\d{2}/g;
    const allAmounts = text.match(amountRegex)?.map(parseFloat) || [];
    const maxAmount = allAmounts.length > 0 ? Math.max(...allAmounts) : null;

    const isCash = /cash/i.test(text);

    let total: number | null = null;
    if (isCash && totalMatch) {
      // If cash payment, rely on keyword total
      total = parseFloat(totalMatch[1]);
    } else {
      // If not cash, pick the highest numeric value
      total = maxAmount;
    }

    return {
      vendor: extractVendor(text),
      date: dateMatch?.[1] || null,
      time: dateMatch?.[2] || null,
      total: total,
    };
  }

  function formatDate(dateStr: string) {
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length === 3) {
      // Assuming dd/mm/yyyy or dd-mm-yyyy
      const [day, month, year] = parts;
      return `${year.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden relative text-black bg-gray-100/10">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col relative z-10">
        {/* Header */}
        <div className="flex m-6">
          <SidebarTrigger className="bg-gray-100 hover:bg-gray-400 hover:text-white border border-gray-400 cursor-pointer" />
          <div className="justify-center items-center pl-4">
            <h1 className="text-lg font-semibold">
              Receipt Management - Upload
            </h1>
          </div>
        </div>

        <main className="flex flex-1 justify-center p-6 pt-0">
          <div className="flex flex-1 rounded-lg shadow border border-gray-400">
            {/* Receipt Preview */}
            <Card className="bg-gray-50 w-7/8 flex flex-col rounded-none border-r border-gray-200">
              <CardHeader className="sticky top-0 z-10 ">
                <CardTitle>Receipt Preview</CardTitle>
                <CardDescription>
                  Preview the uploaded receipt image
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center">
                <div
                  className={
                    file
                      ? "w-[270px] h-auto flex items-center justify-center text-gray-500 rounded"
                      : "w-80 h-[460px] border border-gray-400 bg-gray-100 flex items-center justify-center text-gray-500 rounded"
                  }
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Receipt Preview"
                      className="object-contain"
                    />
                  ) : (
                    "No Receipt"
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Label className="cursor-pointer">
                  <Button
                    className="cursor-pointer"
                    onClick={() => setShowDropzone(true)}
                  >
                    {file ? <>Re-upload</> : <>Upload</>}
                  </Button>
                </Label>
              </CardFooter>
            </Card>

            {/* Dropzone Modal */}
            {showDropzone && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white border border-gray-300 rounded-xl p-8 w-[500px] max-w-[90%] text-center text-gray-600 shadow-lg">
                  {/* Drop Area */}
                  <div
                    className="mb-4 h-[220px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center hover:border-gray-600 transition"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <span className="font-medium text-gray-600">
                      Drag & Drop your receipts here
                    </span>
                  </div>

                  {/* Clickable text */}
                  <p className="text-sm text-gray-500 mb-4">
                    or{" "}
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      click here to select files
                    </span>
                  </p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {/* Actions */}
                  <Button
                    className="mt-2 cursor-pointer"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropzone(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Receipt Details */}
            <Card className="w-1/2 rounded-none border-l border-gray-200 flex flex-col">
              <CardHeader className="sticky top-0 bg-gray-50 z-10">
                <CardTitle>Receipt Details</CardTitle>
                <CardDescription>
                  Check and edit the receipt information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <form className="space-y-4">
                  <div className="grid gap-2 ">
                    <Label htmlFor="vendor">
                      Vendor<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vendor"
                      className="w-[200px]"
                      type="text"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger
                        asChild
                        className="border-r border-gray-200"
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {selectedCategory
                            ? categories.find(
                                (category) =>
                                  category.value === selectedCategory
                              )?.label
                            : "Select Category..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 border-r border-gray-200">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.value}
                                  value={category.value}
                                  onSelect={(currentValue) => {
                                    setSelectedCategory(
                                      currentValue === selectedCategory
                                        ? ""
                                        : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {category.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      selectedCategory === category.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date">
                      Date<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      className="w-[200px]"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">
                      Amount<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount"
                      className="w-[200px]"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="remark">
                      Remark<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="remark"
                      className="w-[200px]"
                      type="text"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 py-2 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="button" className="px-6 py-2 cursor-pointer">
                  Add
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UploadReceipt() {
  return (
    <ProtectedRoute>
      <UploadReceiptContent />
    </ProtectedRoute>
  );
}
