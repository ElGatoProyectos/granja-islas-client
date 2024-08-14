import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrincipalSuppliersSchema } from "@/lib/validations/analytics";
import { formatNumberWithCommas } from "@/utils/format-number-comas";
import { Search } from "lucide-react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function SuppliersTable({
  suppliers,
}: {
  suppliers?: PrincipalSuppliersSchema;
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
