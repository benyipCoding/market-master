"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const data: SymbolItem[] = [
  {
    id: 1,
    category: 316,
    symbol: "XAUUSD",
    description: "ken99@yahoo.com",
  },
  {
    id: 2,
    category: 242,
    symbol: "GBPUSD",
    description: "Abe45@gmail.com",
  },
  {
    id: 3,
    category: 837,
    symbol: "EURUSD",
    description: "Monserrat44@gmail.com",
  },
  {
    id: 4,
    category: 874,
    symbol: "USOIL",
    description: "Silas22@gmail.com",
  },
  {
    id: 5,
    category: 721,
    symbol: "SP50",
    description: "carmella@hotmail.com",
  },
];

export type SymbolItem = {
  id: number;
  description: string;
  symbol: string;
  category: number;
};

export const columns: ColumnDef<SymbolItem>[] = [
  {
    accessorKey: "symbol",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("symbol")}</div>
    ),
  },
  {
    accessorKey: "description",
    cell: ({ row }) => (
      <div className="lowercase ">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "category",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("category"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
];

function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <div className="flex items-center">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm pl-8"
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-2 text-slate-400">
            <Search size={18} />
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="py-2 px-4 border rounded-lg cursor-pointer active:scale-100"
          variant={"ghost"}
        >
          Commodities
        </Button>
        <Button
          className="py-2 px-4 border rounded-lg cursor-pointer active:scale-100"
          variant={"ghost"}
        >
          Forex
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          {/* <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
          </TableHeader> */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
    </div>
  );
}

export default DataTableDemo;
