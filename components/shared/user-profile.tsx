import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { backend_url } from "@/constants/config";
import { useUserInfo } from "@/context/user-context";
import { User } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function UserProfile() {
  const { userInfo } = useUserInfo();
  return (
    <>
      {userInfo ? (
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                Mi perfil
              </DialogTitle>
              <DialogDescription>
                Es importante asegurarse de que la información sea precisa y
                esté actualizada para mantener una comunicación efectiva y el
                correcto funcionamiento del sistema.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full flex flex-col space-y-4">
              <img
                src={`${backend_url}/api/users/file/${userInfo.id}`}
                alt="photo-bussines"
                className="rounded-full "
                height={100}
                width={100}
              />
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Nombres</span>
                <p className="text-muted-foreground">{userInfo.name}</p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Apellidos</span>
                <p className="text-muted-foreground">{userInfo.last_name}</p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Correo Electrónico</span>
                <p className="text-muted-foreground">{userInfo.email}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          <Skeleton className="h-10 w-full" />
        </div>
      )}
    </>
  );
}
