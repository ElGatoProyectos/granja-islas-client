import { Card, CardHeader } from "@/components/ui/card";
import { ModeToggle } from "../dark-mode/mode-toggle";
import { DropdownMenuDemo } from "./user-dropdown";

export function TopBar() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Card className="w-full mb-6 flex-row justify-between">
      <CardHeader className="py-4 flex-row justify-between space-y-0">
        <div className="flex gap-x-2 justify-center items-center">
          <span className="font-bold text-xl">Plan de hoy</span>
          <span className="text-sm font-normal ">{formattedDate}</span>
        </div>
        <div className="flex gap-2">
          <ModeToggle />
          <div className="flex gap-x-2">
            <DropdownMenuDemo />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
