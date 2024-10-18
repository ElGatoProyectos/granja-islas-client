"use client";

import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { getReceipts } from "@/lib/actions/receipt";
import { getReceiptsColumns } from "./receipt-columns";
import { type DataTableFilterField } from "@/types/table-filter-field";
import { TypeReceipt } from "@/types/receipt";
import { getSuppliers } from "@/lib/actions/supplier.actions";
import { useCompanySession } from "@/context/company-context";
import { TypeSupplier } from "@/types/supplier";
import { DataTableRoot } from "@/components/ui-custom/table-server/table-root";
import {
  BILL,
  CREDIT_NOTE,
  DEBIT_NOTE,
  SERVICES,
} from "@/constants/type-document";
import { DataTableToolbar } from "@/components/ui-custom/table-server/table-toolbar";
import { ReceiptsTableToolbarActions } from "./receipt-toolbar-actions";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { receiptViewTable } from "@/utils/change-name";
import { useRuc } from "@/hooks/use-ruc";

interface ReceiptsTableProps {
  receiptsPromise: ReturnType<typeof getReceipts>;
}

export function ReceiptsTable({ receiptsPromise }: ReceiptsTableProps) {
  const { data, total, pageCount } = use(receiptsPromise);
  const { company } = useCompanySession();
  const { ruc } = useRuc();
  const columns = useMemo(() => getReceiptsColumns({ ruc }), [ruc]);

  const [suppliers, setSuppliers] = useState<TypeSupplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);

  const getFilters = useCallback(async () => {
    if (!company) return;
    try {
      const suppliers = await getSuppliers({ ruc: company.ruc });
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

  const filterFields: DataTableFilterField<TypeReceipt>[] = [
    {
      label: "Serie",
      value: "num_serie",
      placeholder: "Buscar Serie o número",
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
      label: "Tipo de pago",
      value: "bill_status_payment",
      options: [
        { value: "CONTADO", label: "Contado" },
        { value: "CREDITO", label: "Credito" },
      ],
    },
    {
      label: "Tipo de documento",
      value: "document_description",
      options: [
        { value: BILL, label: "Factura" },
        { value: CREDIT_NOTE, label: "Nota de crédito" },
        { value: DEBIT_NOTE, label: "Nota de débito" },
        { value: SERVICES, label: "Servicios" },
      ],
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
    <DataTableRoot
      table={table}
      totalElements={total}
      isPending={isPending}
      showElementsSelected
    >
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        changeTitle={receiptViewTable}
        isPending={isPending}
      >
        <ReceiptsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTableRoot>
  );
}
