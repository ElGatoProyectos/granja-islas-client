import { cn } from "@/lib/utils";
interface Props {
  className: string;
}
export function DataTableSkeleton({ className }: Props) {
  return (
    <div className={cn("w-full space-y-2.5 overflow-auto", className)}></div>
  );
}
