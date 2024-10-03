import { BACKEND_URL } from "@/constants/config";

export async function getLabels({
  tokenBack,
  ruc,
}: {
  ruc: string;
  tokenBack: string;
}) {
  const resLabel = await fetch(`${BACKEND_URL}/api/labels`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      ruc,
    },
  });
  return await resLabel.json();
}
