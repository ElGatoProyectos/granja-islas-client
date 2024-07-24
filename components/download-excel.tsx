import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadExcel() {
  return (
    <Button variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Excel
    </Button>
  );
}
