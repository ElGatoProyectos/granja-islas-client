"use client";

import { PaymentsDataTable } from "@/components/payments/table";
import { PaymentProvider } from "@/context/sections/payments-context";

export default function Page() {
  return (
    <section>
      <PaymentProvider>
        <PaymentsDataTable />
      </PaymentProvider>
    </section>
  );
}
