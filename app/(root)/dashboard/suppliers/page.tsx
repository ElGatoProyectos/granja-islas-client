import { LayerPage } from "@/components/layer-page";
import { columns } from "@/components/suppliers/data-table/columns";
import { suppliersData } from "@/components/suppliers/data-table/suppliersData";
import { DataTable } from "@/components/ui/data-table";

export default async function Page() {
  return (
    <LayerPage title="Proveedores">
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
            <SupplierForm />
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
    </LayerPage>
  );
}
