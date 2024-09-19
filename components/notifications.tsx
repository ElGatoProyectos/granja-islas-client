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
import { Card } from "./ui/card";

export function Notifications() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const socket: MutableRefObject<Socket | null> = useRef(null);
  const [notifications, setNotifications] = useState<NotificationSchema[]>();
  const [syncInfo, setSyncInfo] = useState<{
    error: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (company && tokenBack) {
      socket.current = io(`${backend_url}`);
      socket.current.on("notification", (data: NotificationsSchemaIN) => {
        setNotifications(data.payload);
      });
      socket.current.on("sync", (data: { error: boolean; message: string }) => {
        setSyncInfo(data);
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
          {(notifications?.length || syncInfo) && (
            <div className="bg-red-500 h-5 w-5 absolute -top-1 -right-1 rounded-full flex justify-center items-center">
              <p className="text-xs text-white">
                {(syncInfo ? 1 : 0) + (notifications?.length || 0)}
              </p>
            </div>
          )}
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
              {syncInfo ? (
                <p
                  className="text-sm border border-border p-4 rounded-md text-green-500 bg-green-300/20 dark:bg-green-900/20 cursor-pointer"
                  onClick={() => {
                    setSyncInfo(null);
                  }}
                >
                  {syncInfo.message}
                </p>
              ) : null}

              {notifications?.length
                ? notifications.map(
                    ({
                      id,
                      amount_converted,
                      amount_original,
                      type_currency,
                      exchange_rate,
                    }) => (
                      <Card key={id} className="p-4">
                        <Link
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
                      </Card>
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
