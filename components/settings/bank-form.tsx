"use client";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, Pencil, SendHorizontal, Trash, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBanks } from "@/hooks/useBanks";
import { useCompanySession } from "@/context/company-context";
import { createBank, deleteBank, updateBank } from "@/lib/actions/bank.actions";
import { useUserInfo } from "@/context/user-context";
import { useToast } from "../ui/use-toast";

export function BankForm() {
  const [inputValue, setInputValue] = useState("");
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState("");
  const { company } = useCompanySession();
  const { banks, getBanks, loadingBanks } = useBanks();
  const { tokenBack } = useUserInfo();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createBank({ title: inputValue, tokenBack, ruc: company?.ruc });
    setInputValue("");
    getBanks();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editBankId) {
      await updateBank({
        idBank: editBankId,
        title: editInputValue,
        tokenBack,
        ruc: company?.ruc,
      });
      setEditBankId(null);
      setEditInputValue("");
      getBanks();
    }
  };

  const handleEditClick = (id: string, label: string) => {
    setEditBankId(id);
    setEditInputValue(label);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBank({ idBank: id, tokenBack, ruc: company?.ruc });
      getBanks();
      toast({
        variant: "success",
        title: "Se elimino el banco correctamente",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Ocurrio un error al eliminar el banco",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          placeholder="Interbank, BCP, Scotiabank, etc."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
        />
        <Button type="submit">Agregar</Button>
      </form>
      <ScrollArea className="h-72 w-full mt-2">
        {loadingBanks ? (
          <div className="flex  justify-center items-center h-[250px]">
            <Loader2 className="animate-spin stroke-primary h-10 w-10" />
          </div>
        ) : banks.length ? (
          <ul className="flex flex-col gap-2 p-2 pr-3">
            {banks.map(({ id, title }) => (
              <li
                key={id}
                className={cn(
                  "flex justify-between items-center text-sm relative group hover:bg-muted/40 rounded-lg",
                  editBankId === id.toString() ? "" : "pl-3 "
                )}
              >
                {editBankId === id.toString() ? (
                  <form
                    onSubmit={handleEditSubmit}
                    className="flex w-full items-center space-x-2"
                  >
                    <Input
                      type="text"
                      value={editInputValue}
                      onChange={(e) => setEditInputValue(e.currentTarget.value)}
                    />
                    <div className="flex">
                      <Button size="icon" type="submit" variant="ghost">
                        <SendHorizontal className="stroke-primary" />
                        <span className="sr-only">Guardar</span>
                      </Button>
                      <Button
                        size="icon"
                        type="submit"
                        variant="ghost"
                        onClick={() => setEditBankId(null)}
                      >
                        <X className="stroke-destructive" />
                        <span className="sr-only">Cancelar</span>
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="h-[40px] flex items-center">{title}</p>
                    <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(id.toString(), title)}
                      >
                        <Pencil className="stroke-primary h-6 w-6" />
                        <span className="sr-only">Editar banco</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="stroke-red-500" />
                            <span className="sr-only">Borrar banco</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Estas seguro de borrar el banco{" "}
                              <span className="text-primary">{title}</span>?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará
                              permanentemente el banco de nuestros servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(id.toString())}
                              className={buttonVariants({
                                variant: "destructive",
                              })}
                            >
                              Borrar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 mt-4">No hay bancos disponibles</div>
        )}
      </ScrollArea>
    </div>
  );
}
