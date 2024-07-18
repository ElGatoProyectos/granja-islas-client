"use server";
interface Company {
  id: number;
  ruc: string;
  type: string;
  country_code: string;
  phone: string;
  status: string;
  user_sunnat: string;
  corporate_name: string;
  fiscal_address: string;
  password_sunnat: string;
}

export const getCompanies = async (): Promise<Company[] | undefined> => {
  try {
    const res = await fetch("https://retoolapi.dev/PtRhEE/company");
    if (!res.ok) {
      throw new Error("Failed to fetch companies");
    }

    return await res.json();
  } catch (error) {
    console.error("Error to fetch data", error);
  }
};
