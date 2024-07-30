import { UserForm } from "@/components/users/user-form";
import { getUsers } from "@/lib/actions/users.actions";

export default async function Page() {
  const users = await getUsers();

  return (
    <section>
      <div className="flex justify-between">
        <UserForm type="create" />
      </div>
      <div className="mx-auto">
        {users?.map((user) => (
          <div key={user.id} className="p-3 border border-border">
            {user.name}
          </div>
        ))}
      </div>
    </section>
  );
}
