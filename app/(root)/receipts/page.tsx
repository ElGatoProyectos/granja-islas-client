import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { ReceiptsTable } from "@/components/receipts/table/receipt-table";
import { getReceipts } from "@/lib/actions/receipt";
import { getReceiptsSchema } from "@/lib/validations/search-params";
import { TypeParams } from "@/types/params";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: TypeParams) {
  const company_ruc =
    typeof searchParams.ruc === "string" ? searchParams.ruc : "";
  if (!company_ruc) {
    redirect("/onboarding");
  }
  const search = getReceiptsSchema.parse(searchParams);
  const receipts = getReceipts(search);

  return (
    <section>
      <Suspense fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}>
        <ReceiptsTable receiptsPromise={receipts} />
      </Suspense>
    </section>
  );
}
