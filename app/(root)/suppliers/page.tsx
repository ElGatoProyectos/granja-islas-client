import { AddSupplier } from "@/components/suppliers/add-supplier";
import { columns } from "@/components/suppliers/data-table/columns";
import { datatasks } from "@/components/suppliers/data-table/datatasks";
import { suppliersData } from "@/components/suppliers/data-table/suppliersData";
import { Searcher } from "@/components/suppliers/searcher";
import { ViewToggle } from "@/components/suppliers/viewtoggle";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Download } from "lucide-react";

export default async function Page() {
  return (
    <section>
      <h1 className="text-4xl font-bold ml-8 mb-4">Proveedores</h1>
      {/* <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Searcher />
            <ViewToggle />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <AddSupplier />
          </div>
        </div>
        <main>
          <TabsContent value="table">
            
          </TabsContent>
          <TabsContent value="card">card</TabsContent>
        </main>
      </Tabs> */}
      <div className="mx-auto">
        <DataTable columns={columns} data={suppliersData} />
      </div>
    </section>
  );
}
