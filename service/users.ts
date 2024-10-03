import { BACKEND_URL } from "@/constants/config";

export async function getUsers({ tokenBack }: { tokenBack: string }) {
  const resUsers = await fetch(`${BACKEND_URL}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
    },
  });

  return await resUsers.json();
}
