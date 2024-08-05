import { DataTable } from "@/components/ui/data-table";
import { user_columns } from "@/components/users/table/columns";
import { getUsers } from "@/lib/actions/users.actions";

export default async function Page() {
  const users = await getUsers();

  return (
    <section>
      <div className="mx-auto">
        <DataTable columns={user_columns} data={users} />
      </div>
    </section>
  );
}
