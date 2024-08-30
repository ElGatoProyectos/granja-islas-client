"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { io, Socket } from "socket.io-client";
import {
  NotificationSchema,
  NotificationsSchemaIN,
} from "@/lib/validations/notifications";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useUserInfo } from "@/context/user-context";
import { useCompanySession } from "@/context/company-context";
import { backend_url } from "@/constants/config";
import { PEN } from "@/constants/currency";
import { formatWithCommas } from "@/utils/format-number-comas";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import Link from "next/link";

export function Notifications() {
  /* socket */
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const socket: MutableRefObject<Socket | undefined> = useRef();
  const [notifications, setNotifications] = useState<NotificationSchema[]>();

  useEffect(() => {
    if (company && tokenBack) {
      socket.current = io(`${backend_url}`);
      socket.current.on("notification", (data: NotificationsSchemaIN) => {
        setNotifications(data.payload);
      });
      socket.current.emit("init-notification", {
        ruc: company?.ruc,
        token: `Bearer ${tokenBack}`,
      });
    }
  }, [company, tokenBack]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {notifications?.length ? (
            <div className="bg-red-500 h-5 w-5 absolute -top-1 -right-1 rounded-full flex justify-center items-center">
              <p className="text-xs text-white">{notifications.length}</p>
            </div>
          ) : null}
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
            <div className="grid gap-6">
              {notifications?.length
                ? notifications.map(
                    ({
                      id,
                      amount_converted,
                      amount_original,
                      type_currency,
                      exchange_rate,
                    }) => (
                      <Link
                        key={id}
                        href={"/dashboard/payments"}
                        className="flex flex-col "
                      >
                        <span className="text-sm">
                          Pago pendiente de aprobación
                        </span>
                        <p className="text-sm">
                          Monto:{" "}
                          <span className="font-mono text-muted-foreground">
                            {formatWithCommas(amount_original)}{" "}
                          </span>
                        </p>
                        <p className="text-sm">
                          Equivalente en soles:{" "}
                          <span className="font-mono text-muted-foreground">
                            S/.
                            {formatWithCommas(amount_converted)}
                          </span>
                        </p>
                        <div className="space-x-2">
                          {exchange_rate === 1 ? null : (
                            <Badge variant="secondary">
                              TC {exchange_rate}
                            </Badge>
                          )}

                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-bold",
                              type_currency !== PEN
                                ? "text-green-600"
                                : "text-orange-700"
                            )}
                          >
                            {type_currency === PEN
                              ? "PEN/Soles"
                              : type_currency}
                          </Badge>
                        </div>
                      </Link>
                    )
                  )
                : null}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
