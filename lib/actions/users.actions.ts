"use server";

import { authOptions } from "@/app/api/auth-options";
import { backend_url } from "@/constants/config";
import { getServerSession } from "next-auth";

export const getUser = async () => {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${backend_url}/api/users/${session.user.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await res.json();

    console.log("data", data);

    // const formatCompaines = formatCompany(data);

    // return formatCompaines;
  } catch (error) {
    console.error("Error to fetch user", error);
  }
};
