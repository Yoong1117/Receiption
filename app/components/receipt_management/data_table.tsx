"use client";

// React
import { useState } from "react";

// TanStack Table
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// UI Components
import { Button } from "../ui/button";
import { Input } from "~/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 py-4 items-end">
        <div className="flex flex-col w-full sm:w-[200px] md:w-[250px]">
          <label htmlFor="vendor-filter" className="text-sm font-medium mb-2">
            Vendor
          </label>
          <Input
            id="vendor-filter"
            placeholder="Filter vendors..."
            value={
              (table.getColumn("vendor")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("vendor")?.setFilterValue(event.target.value)
            }
            className="bg-[#f8fbff]"
          />
        </div>

        <div className="flex flex-col w-full sm:w-[200px] md:w-[250px]">
          <label htmlFor="payment-filter" className="text-sm font-medium mb-2">
            Payment Method
          </label>
          <Input
            id="payment-filter"
            placeholder="Filter payment methods..."
            value={
              (table.getColumn("payment")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("payment")?.setFilterValue(event.target.value)
            }
            className="bg-[#f8fbff]"
          />
        </div>

        <div className="flex flex-col w-full sm:w-[200px] md:w-[250px]">
          <label htmlFor="category-filter" className="text-sm font-medium mb-2">
            Category
          </label>
          <Input
            id="category-filter"
            placeholder="Filter category..."
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("category")?.setFilterValue(event.target.value)
            }
            className="bg-[#f8fbff]"
          />
        </div>

        {/* Columns button wrapper */}
        <div className="flex flex-col w-auto sm:w-auto sm:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-black hover:bg-black/65 border border-gray-200 text-white hover:text-white cursor-pointer"
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-blue-200">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table contents */}
      <div className="bg-[#F1F7FD] overflow-hidden rounded-md border !border-blue-200 mt-4">
        <Table className="">
          <TableHeader className="bg-[#C8DFF5]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="!border-blue-200 hover:bg-[#C8DFF5]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="!border-blue-200 bg-[#F1F7FD]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pl-5 capitalize">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Page pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-[#4077D0] hover:bg-[#3763BE] border border-blue-200 text-white hover:text-white cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#4077D0] hover:bg-[#3763BE] border border-blue-200 text-white hover:text-white cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
