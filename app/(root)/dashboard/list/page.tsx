import { ListsDataTable } from "@/components/lists/table";
import { ListProvider } from "@/context/sections/lists-context";

export default function Page() {
  return (
    <section>
      <ListProvider>
        <ListsDataTable />
      </ListProvider>
    </section>
  );
}
