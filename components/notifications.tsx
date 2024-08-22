"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";

export function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="bg-red-500 h-5 w-5 absolute -top-1 -right-1 rounded-full flex justify-center items-center">
            <p className="text-xs">13</p>
          </div>
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <ScrollArea className="h-96 w-full">
          <div className="grid gap-6 p-6">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Notificaciones</h4>
              <p className="text-sm text-muted-foreground">
                Mantente al tanto de los últimos cambios en tu sistema.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="flex flex-col">
                <span className="">Notificacion 1</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 2</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 3</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 4</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 5</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 6</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 7</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 8</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
              <div className="flex flex-col">
                <span className="">Notificacion 9</span>
                <p className="text-sm text-muted-foreground">
                  contexto de la notificacion
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
