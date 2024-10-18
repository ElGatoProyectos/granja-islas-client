"use client";

import { DataTableRoot } from "@/components/ui-custom/table-server/table-root";
import { DataTableToolbar } from "@/components/ui-custom/table-server/table-toolbar";
import { useCompanySession } from "@/context/company-context";
import { useDataTable } from "@/hooks/use-data-table";
import { getLabels } from "@/lib/actions/label.actions";
import {
  getProductsOfSupplier,
  getSuppliers,
} from "@/lib/actions/supplier.actions";
import { TypeLabel } from "@/types/label";
import { TypeProductsOfSupplierTable, TypeSupplier } from "@/types/supplier";
import { type DataTableFilterField } from "@/types/table-filter-field";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { productsOfSupplierViewTable } from "@/utils/change-name";
import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { getProductsOfSupplierColumns } from "./supplier-products-columns";
import { ProductsOfSupplierTableToolbarActions } from "./supplier-products-toolbar-actions";

interface ProductsOfSupplierTableProps {
  productsOfSupplierPromise: ReturnType<typeof getProductsOfSupplier>;
}

export function ProductsOfSupplierTable({
  productsOfSupplierPromise,
}: ProductsOfSupplierTableProps) {
  const { data, total, pageCount } = use(productsOfSupplierPromise);
  const { company } = useCompanySession();
  const [labels, setLabels] = useState<TypeLabel[]>([]);
  const columns = useMemo(() => getProductsOfSupplierColumns(), []);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);

  const getFilters = useCallback(async () => {
    if (!company) return;
    try {
      const labels = await getLabels({ company_ruc: company.ruc });
      setLabels(labels);
    } catch (error) {
      console.error("Error loading suppliers", error);
    } finally {
      setIsLoadingSuppliers(false);
    }
  }, [company]);

  useEffect(() => {
    getFilters();
  }, [getFilters]);

  const filterFields: DataTableFilterField<TypeProductsOfSupplierTable>[] = [
    {
      label: "Titulo",
      value: "title",
      placeholder: "Buscar nombre del producto",
    },
    {
      label: "Etiquetas",
      value: "product_labels",
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
        changeTitle={productsOfSupplierViewTable}
        isPending={isPending}
      >
        <ProductsOfSupplierTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTableRoot>
  );
}
