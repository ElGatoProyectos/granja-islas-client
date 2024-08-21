import { backend_url } from "@/constants/config";

export async function getLabels({
  tokenBack,
  ruc,
}: {
  ruc: string;
  tokenBack: string;
}) {
  const resLabel = await fetch(`${backend_url}/api/labels`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      ruc,
    },
  });
  return await resLabel.json();
}
