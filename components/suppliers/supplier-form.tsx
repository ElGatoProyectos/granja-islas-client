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
import {
  CreateSupplierSchema,
  createSupplierSchema,
  SupplierSchemaIN,
} from "@/lib/validations/supplier";
import { Loader2, Plus, Search } from "lucide-react";
import { createSupplier, updateSupplier } from "@/lib/actions/supplier.actions";
import { useUserInfo } from "@/context/user-context";
import { useCompanySession } from "@/context/company-context";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { backend_url } from "@/constants/config";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface Props {
  type: "create" | "edit";
  supplier?: SupplierSchemaIN;
  getSuppliers: () => Promise<void>;
  loadingSuppliers?: boolean;
}

export function SupplierForm({
  type,
  supplier,
  getSuppliers,
  loadingSuppliers,
}: Props) {
  const form = useForm<z.infer<typeof createSupplierSchema>>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      ruc: supplier?.ruc ?? "",
      business_name: supplier?.business_name ?? "",
      business_type: supplier?.business_type ?? "",
      business_status: supplier?.business_status ?? "",
      business_direction: supplier?.business_direction ?? "",
      country_code: supplier?.country_code ?? "",
      phone: supplier?.phone ?? "",
    },
  });

  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof createSupplierSchema>) {
    setSubmitting(true);

    try {
      if (type === "create") {
        await createSupplier({
          values,
          tokenBack,
          ruc: company?.ruc,
        });
      }
      if (type === "edit") {
        await updateSupplier({
          tokenBack,
          values,
          ruc: company?.ruc,
          supplierID: supplier?.id,
        });
      }
      toast({
        variant: "success",
        title: `Se ${
          type === "create" ? "creó" : "editó"
        } correctamente el proveedor`,
      });
      getSuppliers();
      setOpen(false);
      form.reset();
    } catch (e: any) {
      if (e.message) {
        toast({
          variant: "destructive",
          title: e.message,
        });
        return;
      }
      toast({
        variant: "destructive",
        title: `Ocurrio un error al ${
          type === "create" ? "crear" : "editar"
        } el proveedor, intenta otra vez.`,
      });
    } finally {
      setSubmitting(false);
    }
  }
  const [loadingDataOfRuc, setloadingDataOfRuc] = useState(false);
  const getRucData = async () => {
    const ruc = form.watch("ruc");
    if (!ruc) return;
    if (!company) return;
    setloadingDataOfRuc(true);
    try {
      const res = await fetch(`${backend_url}/api/sunat/ruc/v1/${ruc}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: `Ocurrio un error al buscar por ruc, intenta otra vez.`,
        });
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: `Ocurrio un error al buscar por ruc, intenta otra vez.`,
        });
        throw new Error(`Data error backend ${data.statusCode}`);
      }

      const {
        business_name,
        business_type,
        business_status,
        business_direction_fiscal,
        country_code,
        phone_number,
      } = data.payload;

      form.setValue("business_name", business_name);
      form.setValue("business_type", business_type);
      form.setValue("business_status", business_status);
      form.setValue("business_direction", business_direction_fiscal);
      form.setValue("country_code", country_code);
      form.setValue("phone", phone_number);
      toast({
        variant: "success",
        title: `Se encontraron datos con ese ruc`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al buscar por ruc, intenta otra vez.`,
      });
      console.error("Error fetching data:", error);
    } finally {
      setloadingDataOfRuc(false);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button disabled={loadingSuppliers}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Proveedor
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Editar Proveedor
          </DropdownMenuItem>
        )}
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
                    <Input
                      {...field}
                      placeholder="Numero de RUC"
                      disabled={submitting || loadingDataOfRuc}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-6 right-0"
                    disabled={submitting || loadingDataOfRuc}
                    onClick={getRucData}
                  >
                    {loadingDataOfRuc ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="shrink-0 stroke-primary" />
                    )}
                    <span className="sr-only">Buscar por ruc</span>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón social</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={submitting || loadingDataOfRuc}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EIRL, SAC, SA, etc."
                      {...field}
                      disabled={submitting || loadingDataOfRuc}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={submitting || loadingDataOfRuc}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección fiscal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={submitting || loadingDataOfRuc}
                    />
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
                    <CodeCountry
                      form={form}
                      disabled={submitting || loadingDataOfRuc}
                    />
                    <FormControl className="ml-2">
                      <Input
                        {...field}
                        type="tel"
                        autoComplete="off"
                        autoCorrect="off"
                        inputMode="numeric"
                        disabled={submitting || loadingDataOfRuc}
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
              <Button type="submit" disabled={submitting || loadingDataOfRuc}>
                {type === "create" ? "Registrar" : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
