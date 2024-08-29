"use server";

import { authOptions } from "@/app/api/auth-options";
import { backend_url } from "@/constants/config";
import { getServerSession } from "next-auth";
import { UserSchemaIN } from "../validations/user";

export async function getUsers(): Promise<UserSchemaIN[]> {
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
    return [];
  }
}

export async function createUser({
  tokenBack,
  userFormInfo,
}: {
  tokenBack: string;
  userFormInfo: any;
}) {
  const res = await fetch(`${backend_url}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userFormInfo),
  });

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

  try {
    const res = await fetch(`${backend_url}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
      },
      body: formData,
    });

    const resJSON = await res.json();
    if (resJSON.error) {
      throw new Error("Failed to update user");
    }
  } catch (e) {
    throw new Error("Failed to update user");
  }
}

export async function deleteUser({
  tokenBack,
  userId,
}: {
  tokenBack: string;
  userId: number;
}) {
  try {
    const res = await fetch(`${backend_url}/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
      },
    });

    const resJSON = await res.json();
    if (resJSON.error) {
      throw new Error("Failed to update user");
    }
  } catch (e) {
    throw new Error("Failed to update user");
  }
}
