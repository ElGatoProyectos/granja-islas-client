import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";

export function ViewToggle() {
  return (
    <div>
      <TabsList className="p-0 h-fit bg-transparent space-x-1">
        <TabsTrigger
          value="table"
          className="w-fit p-2 data-[state=active]:text-primary data-[state=active]:bg-muted bg-card border-border border"
        >
          <List className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger
          value="card"
          className="w-fit p-2 data-[state=active]:text-primary data-[state=active]:bg-muted bg-card border-border border"
        >
          <LayoutGrid className="h-5 w-5" />
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
