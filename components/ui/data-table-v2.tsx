"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dispatch, SetStateAction, useState } from "react";
import { DataTableToolbar } from "../suppliers/data-table/table-toolbar";
import { DataTablePagination } from "../ui-custom/table-pagination";
import { TabsContent } from "./tabs";
import { Card, CardHeader, CardTitle } from "./card";
import { SupplierSchemaIN } from "@/lib/validations/supplier";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "./skeleton";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  suppliers: SupplierSchemaIN[];
  pagesCount: number;
  rowsPerPage: number;
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  totalElements: number;
  loadingSuppliers?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  suppliers,
  pagesCount,
  rowsPerPage,
  currentPage,
  setPage,
  setRowsPerPage,
  totalElements,
  loadingSuppliers,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    pageCount: pagesCount,
    rowCount: rowsPerPage,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: currentPage - 1, pageSize: rowsPerPage },
    },
    enableRowSelection: true,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <TabsContent value="table">
        {/* <div>
          wtf
          <Skeleton className="h-4 w-[250px]" />
          {new Array(10).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[250px]" />
          ))}
        </div> */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
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
            </TableHeader>
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
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="card">
        <div className="grid grid-cols-3 gap-5 place-content-center">
          {suppliers.length ? (
            suppliers.map(({ id, business_name, ruc }) => (
              <Card key={id} className="flex items-center ">
                <CardHeader className="space-y-0 flex-row gap-4 justify-between items-center w-full">
                  <CardTitle className="text-base font-normal capitalize flex gap-6 w-full items-center">
                    <BriefcaseBusiness className="h-10 min-w-10 stroke-primary" />
                    <div className="flex flex-col gap-2">
                      {business_name.length > 27 ? (
                        <p>{`${business_name
                          .toLowerCase()
                          .substring(0, 27)}...`}</p>
                      ) : (
                        <p>{business_name.toLowerCase()}</p>
                      )}

                      <p className="text-muted-foreground">
                        {ruc.toLowerCase()}
                      </p>
                    </div>
                  </CardTitle>
                  <Link href={`${pathname}/${id}`}>
                    <ChevronRight className="h-12 min-w-12 stroke-primary" />
                  </Link>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="h-[600px] col-span-3 flex justify-center items-center">
              <p className="h-24 text-center">Sin resultados.</p>
            </div>
          )}
        </div>
      </TabsContent>
      <DataTablePagination
        table={table}
        setCurrentPage={setPage}
        setLimit={setRowsPerPage}
        currentPage={currentPage}
        totalElements={totalElements}
        arrayOfRows={[9, 18]}
      />
    </div>
  );
}
