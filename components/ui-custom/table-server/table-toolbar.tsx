"use client";

import * as React from "react";

import type { Table } from "@tanstack/react-table";
import type { DataTableFilterField } from "@/types/table-filter-field";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./table-view-options";
import { DataTableFacetedFilter } from "./table-faceted-filter";
import { X } from "lucide-react";
import { PeriodsRange } from "@/components/periods-range";
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  changeTitle: (id: string) => string;
  isPending: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  changeTitle,
  isPending,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div className={cn("flex flex-col w-full space-y-3", className)} {...props}>
      <div className="flex w-full items-center justify-between space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumns.length > 0 &&
            searchableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : "") && (
                  <Input
                    key={String(column.value)}
                    placeholder={column.placeholder}
                    value={
                      (table
                        .getColumn(String(column.value))
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn(String(column.value))
                        ?.setFilterValue(event.target.value)
                    }
                    className="w-[150px] lg:w-[270px]"
                  />
                )
            )}
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : "") && (
                  <DataTableFacetedFilter
                    key={String(column.value)}
                    column={table.getColumn(
                      column.value ? String(column.value) : ""
                    )}
                    title={column.label}
                    options={column.options ?? []}
                    isLoading={isPending}
                  />
                )
            )}
          {isFiltered && (
            <Button
              aria-label="Reset filters"
              variant="ghost"
              className="px-3"
              onClick={() => table.resetColumnFilters()}
              disabled={isPending}
            >
              Reset
              <X className="ml-2 size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {children}
          <DataTableViewOptions table={table} changeTitle={changeTitle} />
        </div>
      </div>
      <PeriodsRange
        monthStarted={START_MONTH_SYNC}
        yearStarted={START_YEAR_SYNC}
        isLoading={isPending}
        currentDate
      />
    </div>
  );
}
