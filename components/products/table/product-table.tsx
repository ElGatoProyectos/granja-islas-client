"use client";

import { DataTableRoot } from "@/components/ui-custom/table-server/table-root";
import { DataTableToolbar } from "@/components/ui-custom/table-server/table-toolbar";
import { useCompanySession } from "@/context/company-context";
import { useDataTable } from "@/hooks/use-data-table";
import { getLabels } from "@/lib/actions/label.actions";
import { getProducts } from "@/lib/actions/product";
import { getSuppliers } from "@/lib/actions/supplier.actions";
import { TypeLabel } from "@/types/label";
import { TypeProductTableFormat } from "@/types/product";
import { TypeSupplier } from "@/types/supplier";
import { type DataTableFilterField } from "@/types/table-filter-field";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { productsViewTable } from "@/utils/change-name";
import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { getProductsColumns } from "./product-columns";
import { ReceiptsTableToolbarActions } from "./product-toolbar-actions";

interface ProductsTableProps {
  productsPromise: ReturnType<typeof getProducts>;
}

export function ProductsTable({ productsPromise }: ProductsTableProps) {
  const { data, total, pageCount } = use(productsPromise);
  const { company } = useCompanySession();

  const [suppliers, setSuppliers] = useState<TypeSupplier[]>([]);
  const [labels, setLabels] = useState<TypeLabel[]>([]);
  const columns = useMemo(() => getProductsColumns(), []);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);

  const getFilters = useCallback(async () => {
    if (!company) return;
    try {
      const suppliers = await getSuppliers({ ruc: company.ruc });
      const labels = await getLabels({ company_ruc: company.ruc });
      setLabels(labels);
      setSuppliers(suppliers);
    } catch (error) {
      console.error("Error loading suppliers", error);
    } finally {
      setIsLoadingSuppliers(false);
    }
  }, [company]);

  useEffect(() => {
    getFilters();
  }, [getFilters]);

  const filterFields: DataTableFilterField<TypeProductTableFormat>[] = [
    {
      label: "Titulo",
      value: "title",
      placeholder: "Buscar nombre del producto",
    },
    {
      label: "Proveedor",
      value: "supplier_name",
      options: isLoadingSuppliers
        ? [{ label: "Cargando...", value: "" }]
        : suppliers.map((supplier) => ({
            label: capitalizeFirstLetter(supplier.business_name),
            value: supplier.id.toString(),
          })),
    },
    {
      label: "Etiquetas",
      value: "labels",
      options: isLoadingSuppliers
        ? [{ label: "Cargando...", value: "" }]
        : labels.map((label) => ({
            label: capitalizeFirstLetter(label.title),
            value: label.id.toString(),
          })),
    },
  ];
  const [isPending, startTransition] = useTransition();
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
    history: "push",
    startTransition,
  });

  return (
    <DataTableRoot table={table} totalElements={total} isPending={isPending}>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        changeTitle={productsViewTable}
        isPending={isPending}
      >
        <ReceiptsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTableRoot>
  );
}
