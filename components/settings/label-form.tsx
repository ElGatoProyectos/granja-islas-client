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
import { useCompanySession } from "@/context/company-context";
import { useLabels } from "@/hooks/useLabels";
import { useUserInfo } from "@/context/user-context";
import {
  createLabel,
  deleteLabel,
  updateLabel,
} from "@/lib/actions/label.actions";

export function LabelForm() {
  const [inputValue, setInputValue] = useState("");
  const [editLabelId, setEditLabelId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState("");
  const { company } = useCompanySession();
  const { tokenBack } = useUserInfo();
  const { labels, loadingLabel, getLabels } = useLabels();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createLabel({ ruc: company?.ruc, tokenBack, title: inputValue });
    setInputValue("");
    getLabels();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editLabelId) {
      await updateLabel({
        idLabel: editLabelId,
        title: editInputValue,
        tokenBack,
        ruc: company?.ruc,
      });
      setEditLabelId(null);
      setEditInputValue("");
      getLabels();
    }
  };

  const handleEditClick = (id: string, label: string) => {
    setEditLabelId(id);
    setEditInputValue(label);
  };

  const handleDelete = async (id: string) => {
    await deleteLabel({ idLabel: id, tokenBack, ruc: company?.ruc });
    getLabels();
  };

  return (
    <div className="flex flex-col">
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          placeholder="Maíz, soya, diesel, etc."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
        />
        <Button type="submit">Agregar</Button>
      </form>

      <ScrollArea className="h-72 w-full mt-4">
        {loadingLabel ? (
          <div className="flex  justify-center items-center h-[250px]">
            <Loader2 className="animate-spin stroke-primary h-10 w-10" />
          </div>
        ) : labels.length ? (
          <ul className="flex flex-col gap-2 p-2">
            {labels.map(({ id, title }) => (
              <li
                key={id}
                className={cn(
                  "flex justify-between items-center text-sm relative group rounded-lg",
                  editLabelId === id.toString() ? "" : "pl-3 hover:bg-muted/40"
                )}
              >
                {editLabelId === id.toString() ? (
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
                        onClick={() => setEditLabelId(null)}
                      >
                        <X className="stroke-red-500" />
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
                        <span className="sr-only">Editar empresa</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="stroke-red-500" />
                            <span className="sr-only">Borrar empresa</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Estas seguro de borrar la etiqueta{" "}
                              <span className="text-primary">{title}</span>?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará
                              permanentemente su etiqueta de nuestros
                              servidores.
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
          <div className="text-center py-4 mt-4">
            No hay etiquetas disponibles
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
