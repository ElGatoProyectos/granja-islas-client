"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeCountry } from "../auth/onboarding/code-country";
import { supplierSchema } from "@/lib/validations/supplier";
import { Plus, Search } from "lucide-react";

interface Supplier {
  ruc: string;
  corporate_name: string;
  type: string;
  status: string;
  fiscal_address: string;
  country_code: string;
  phone: string;
}

interface Props {
  type: "create" | "edit";
  supplier?: Supplier;
}

export function SupplierForm({ type, supplier }: Props) {
  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      ruc: supplier?.ruc ?? "",
      corporate_name: supplier?.corporate_name ?? "",
      type: supplier?.type ?? "",
      status: supplier?.status ?? "",
      fiscal_address: supplier?.fiscal_address ?? "",
      country_code: supplier?.country_code ?? "",
      phone: supplier?.phone ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof supplierSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Proveedor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            {type === "create" ? "Registrar" : "Editar"} Proveedor
          </DialogTitle>
          <DialogDescription>
            Completa la información requerida para registrar un proveedor,
            incluyendo su RUC, razón social, dirección y otros datos relevantes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="ruc"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>RUC</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Numero de RUC" />
                  </FormControl>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-0 right-0"
                  >
                    <Search className="shrink-0 stroke-primary" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="corporate_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="EIRL, SAC, SA, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fiscal_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección fiscal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <div className="flex">
                    <CodeCountry form={form} />
                    <FormControl className="ml-2">
                      <Input
                        {...field}
                        type="tel"
                        // universal input options
                        autoComplete="off"
                        autoCorrect="off"
                        inputMode="numeric"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="!mt-6 !justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                {type === "create" ? "Registrar" : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
