"use client";

import { ReceiptsDataTable } from "@/components/receipts/table";
import { ReceiptProvider } from "@/context/sections/receipts-context";

export default function Page() {
  return (
    <section>
      <ReceiptProvider>
        <ReceiptsDataTable />
      </ReceiptProvider>
    </section>
  );
}
