import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Searcher() {
  return (
    <section className="relative">
      <Search className="absolute stroke-gray-400 top-2 left-3 w-5 h-5" />
      <Input
        placeholder="Buscar proveedor"
        type="text"
        className="h-9 pl-10 placeholder:text-gray-400"
      />
    </section>
  );
}
