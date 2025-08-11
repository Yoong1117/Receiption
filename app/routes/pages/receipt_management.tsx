import { Button } from "~/components/ui/button";
import type { Route } from "./+types/receipt_management";
import { AppSidebar } from "~/components/app_sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";
import ProtectedRoute from "~/components/ProtectedRoute";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Management" }];
}

function ReceiptManagementContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen w-full relative text-black">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative p-6 overflow-auto">
        {/* Header Row */}
        <div className="flex mb-6">
          <SidebarTrigger className="bg-gray-100 hover:bg-gray-400 hover:text-white border border-gray-400 cursor-pointer" />
          <div className="justify-center items-center pl-4">
            <h1 className="text-lg font-semibold">
              Receipt Management - Overview
            </h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-200 text-center py-6 rounded">
            <p className="text-sm">Total Receipt</p>
            <p className="text-2xl font-bold">52</p>
          </div>
          <div className="bg-gray-200 text-center py-6 rounded">
            <p className="text-sm">Total Amount Spent</p>
            <p className="text-2xl font-bold">RM 1626.20</p>
          </div>
        </div>

        {/* Filter and Upload */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex-1 bg-gray-300 text-center py-2 rounded">
            Filters container
          </div>
          <Button
            className="px-4 cursor-pointer"
            onClick={() => navigate("/receipt_upload")}
          >
            Upload
          </Button>
        </div>

        {/* Receipt Table */}
        <div className="bg-gray-200 rounded p-6 flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-5 font-medium mb-4">
            <span>Vendor</span>
            <span>Date</span>
            <span>Category</span>
            <span>Total</span>
            <span>Action</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-700 overflow-auto">
            Receipt List
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptManagement() {
  return (
    <ProtectedRoute>
      <ReceiptManagementContent />
    </ProtectedRoute>
  );
}
