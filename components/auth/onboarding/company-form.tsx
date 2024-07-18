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
import { companySchema } from "@/lib/validations/auth/company";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Image as AddImage, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CodeCountry } from "./code-country";

interface company {
  ruc: string;
  corporate_name: string;
  type: string;
  status: string;
  fiscal_address: string;
  country_code: string;
  phone: string;
  user_sunnat: string;
  password_sunnat: string;
}

interface Props {
  type: "create" | "edit";
  company?: company;
}

export function CompanyForm({ type, company }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      ruc: company?.ruc ?? "",
      corporate_name: company?.corporate_name ?? "",
      type: company?.type ?? "",
      status: company?.status ?? "",
      fiscal_address: company?.fiscal_address ?? "",
      country_code: company?.country_code ?? "",
      phone: company?.phone ?? "",
      user_sunnat: company?.user_sunnat ?? "",
      password_sunnat: company?.password_sunnat ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof companySchema>) {
    console.log(values);
  }

  return (
    <DialogContent className="sm:max-w-[500px] h-full overflow-y-scroll overflow-x-hidden gap-0">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold">
          {type === "create" ? "Nueva" : "Editar"} Empresa
        </DialogTitle>
        <DialogDescription>
          Esto te permitirá gestionar todas las empresas asociadas de manera
          ordenada y eficiente.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          autoComplete="off"
        >
          <div className="flex items-center justify-center">
            <div
              className={`flex h-[fit-content] md:p-4 md:justify-between md:flex-row 
                        
            `}
            >
              {selectedImage ? (
                <div className="md:max-w-[100px]">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="rounded-full aspect-square"
                  />
                </div>
              ) : (
                <div className="inline-flex items-center justify-between">
                  <div className="p-7 bg-slate-200 justify-center items-center flex rounded-full">
                    <AddImage className="stroke-foreground" />
                  </div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button type="button" variant="ghost">
                      <Input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        accept="image/*"
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setSelectedImage(e.target.files?.[0] || null);
                        }}
                        ref={field.ref}
                      />
                      <Label
                        htmlFor="fileInput"
                        className="inline-flex items-center cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2 stroke-foreground" />
                        <span className="whitespace-nowrap">
                          Elija la imagen
                        </span>
                      </Label>
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUC</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Numero de RUC" />
                </FormControl>
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
                    <Input {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user_sunnat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Usuario <span className="text-gray-400 text-xs">(SUNAT)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_sunnat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Clave SOL{" "}
                  <span className="text-gray-400 text-xs">(SUNAT)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="!mt-3 !justify-between">
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
              {type === "create" ? "Crear" : "Actualizar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
