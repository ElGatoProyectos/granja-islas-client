import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "./menu";
import { CompanyCard } from "../company-card";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open menu responsive</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-60 px-3 h-full flex flex-col" side="left">
        <SheetTitle>
          <CompanyCard isOpen />
          <SheetDescription></SheetDescription>
        </SheetTitle>

        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
