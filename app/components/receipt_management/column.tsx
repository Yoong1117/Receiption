"use client";

// React Router
import { useNavigate } from "react-router";

import type { ColumnDef } from "@tanstack/react-table";

// UI components
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Receipt = {
  id: string;
  vendor: string;
  payment: string;
  category: string;
  date: string;
  upload: string;
  amount: string;
};

export const createColumns = ({
  onDeleteClick,
  onRestoreClick,
  from,
}: {
  onDeleteClick: (receipt: Receipt) => void;
  onRestoreClick?: (receipt: Receipt) => void;
  from: string | null;
}): ColumnDef<Receipt>[] => [
  {
    accessorKey: "vendor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-[#C8DFF5]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vendor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-[#C8DFF5]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Method
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-[#C8DFF5]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-[#C8DFF5]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Receipt Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "upload",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-[#C8DFF5]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Upload Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-[#C8DFF5]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const receipt = row.original;
      const navigate = useNavigate();

      if (from === "receipt_management") {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(receipt.id)}
                className="cursor-pointer"
              >
                Copy Receipt ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/receipt_management/receipt_edit/${receipt.id}`)
                }
              >
                View/Edit Receipt Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-700 focus:text-red-700"
                onClick={() => onDeleteClick(receipt)}
              >
                Delete Receipt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }

      if (from === "receipt_deleted") {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(receipt.id)}
                className="cursor-pointer"
              >
                Copy Receipt ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onRestoreClick?.(receipt)} // implement restore logic here
              >
                Restore Receipt
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-700 focus:text-red-700"
                onClick={() => onDeleteClick(receipt)}
              >
                Permanently Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
  },
];
