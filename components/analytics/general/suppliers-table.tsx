import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypeprincipalSuppliers } from "@/types/analytic";
import { formatNumberWithCommas } from "@/utils/format-number-comas";
import { Search } from "lucide-react";

export function SuppliersTable({
  suppliers,
}: {
  suppliers?: TypeprincipalSuppliers[];
}) {
  return (
    <>
      {suppliers?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ruc</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Total de compras</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map(({ ruc, business_name, total }) => (
              <TableRow key={ruc}>
                <TableCell className="font-medium">{ruc}</TableCell>
                <TableCell>{business_name}</TableCell>
                <TableCell className="text-right">
                  {formatNumberWithCommas(total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="h-full w-full flex justify-center items-center my-20">
          <div className="flex flex-col items-center gap-y-2">
            <Search className="stroke-gray-600 h-12 w-12" />
            <span className="text-gray-600 text-balance text-center">
              Lo sentimos, no encontramos proveedores con esos criterios.
            </span>
          </div>
        </div>
      )}
    </>
  );
}
