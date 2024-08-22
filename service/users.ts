import { backend_url } from "@/constants/config";

export async function getUsers({ tokenBack }: { tokenBack: string }) {
  const resUsers = await fetch(`${backend_url}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
    },
  });

  return await resUsers.json();
}
