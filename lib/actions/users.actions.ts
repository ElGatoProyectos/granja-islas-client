"use server";

import { authOptions } from "@/app/api/auth-options";
import { backend_url } from "@/constants/config";
import { UserTypeIn } from "@/types";
import { getServerSession } from "next-auth";

export async function getUsers(): Promise<UserTypeIn[] | undefined> {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${backend_url}/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();

    return data.payload;
  } catch (error) {
    console.error("Error to fetch data", error);
  }
}

export async function createUser({
  tokenBack,
  formData,
}: {
  tokenBack: string;
  formData: FormData;
}) {
  console.log("tokenBack", tokenBack);
  const res = await fetch(`${backend_url}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  console.log("res", res);

  if (!res.ok) {
    throw new Error("Failed to post user");
  }
}

export async function updateUser({
  tokenBack,
  userId,
  formData,
}: {
  tokenBack: string;
  userId?: number;
  formData: FormData;
}) {
  if (!userId) throw new Error("No id for update user");
  const res = await fetch(`${backend_url}/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }
}
