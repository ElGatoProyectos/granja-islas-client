import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface Props {
  suppliers: {
    ruc: string;
    corporate_name: string;
    country_code: string;
    phone: string;
  }[];
}

export function SuppliersTable({ suppliers }: Props) {
  return (
    <>
      {suppliers.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ruc</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Celular</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map(({ ruc, corporate_name, country_code, phone }) => (
              <TableRow key={ruc}>
                <TableCell className="font-medium">{ruc}</TableCell>
                <TableCell>{corporate_name}</TableCell>
                <TableCell className="text-right">
                  {country_code + " " + phone}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="h-full flex justify-center items-center">
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
