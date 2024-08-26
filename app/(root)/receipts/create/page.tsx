import { BillForm } from "@/components/receipts/forms/bill-form";
import { CreditNoteForm } from "@/components/receipts/forms/credit-note-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <Tabs defaultValue="bill" className="w-full">
      <TabsList className="flex w-[600px]">
        <TabsTrigger value="bill">Factura</TabsTrigger>
        <TabsTrigger value="credit_note">Nota de crédito</TabsTrigger>
        <TabsTrigger value="debit_note">Nota de débito</TabsTrigger>
      </TabsList>
      <BillForm />
      <CreditNoteForm />
    </Tabs>
  );
}
