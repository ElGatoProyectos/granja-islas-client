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
  CreateCompanySchema,
  createCompanySchema,
} from "@/lib/validations/auth/company";
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
import { useState } from "react";
import { Image as AddImage, Pencil, Plus, Search, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CodeCountry } from "./code-country";
import { useSession } from "next-auth/react";
import { backend_url } from "@/constants/config";
import { CompanyFetch } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { createCompany, updateCompany } from "@/lib/actions/company.actions";
import { revalidatePath } from "next/cache";

interface Props {
  type: "create" | "edit";
  company?: CreateCompanySchema;
  companyId?: number;
}

export function CompanyForm({ type, company, companyId }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createCompanySchema>>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      ruc: company?.ruc ?? "",
      business_name: company?.business_name ?? "",
      business_type: company?.business_type ?? "",
      business_status: company?.business_status ?? "",
      business_direction_fiscal: company?.business_direction_fiscal ?? "",
      country_code: company?.country_code ?? "",
      phone: company?.phone ?? "",
      user: company?.user ?? "",
      key: company?.key ?? "",
      client_id: company?.client_id ?? "",
      client_secret: company?.client_secret ?? "",
    },
  });

  const { data: session }: { data: any } = useSession();

  const route = useRouter();
  async function onSubmit(values: z.infer<typeof createCompanySchema>) {
    setSubmitting(true);
    const { image, ...company } = values;

    const formData = new FormData();

    if (image) {
      console.log("image", image);
      formData.append("company-profile", image[0]);
    }
    type CompanyWithoutKey = Omit<CompanyFetch, "id">;
    for (const key in company) {
      if (company.hasOwnProperty(key)) {
        formData.append(key, company[key as keyof CompanyWithoutKey]);
      }
    }

    try {
      if (type === "create") {
        await createCompany({ formData, tokenBack: session.user.tokenBack });
      }

      if (type === "edit") {
        await updateCompany({
          companyId,
          formData,
          tokenBack: session.user.tokenBack,
        });
      }

      toast({
        variant: "success",
        title: `Se ${
          type === "create" ? "creó" : "editó"
        } correctamente la empresa`,
      });

      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: `Ocurrio un error al ${
          type === "create" ? "crear" : "editar"
        } la empresa, intenta otra vez.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const urlUpdate = `${backend_url}/api/companies/file/${companyId}`;

  const getRucData = async () => {
    const ruc = form.watch("ruc");
    if (!ruc) return;
    try {
      const res = await fetch(`${backend_url}/api/sunat/ruc/${ruc}`, {
        method: "GET",
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
      form.setValue("business_direction_fiscal", business_direction_fiscal);
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
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button variant="ghost" className="hover:text-primary mt-2">
            <Plus className="h-5 w-5 mr-2" />
            Nueva Empresa
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Pencil className="stroke-primary" />
            <span className="sr-only">Editar empresa</span>
          </Button>
        )}
      </DialogTrigger>
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
                className={`flex h-[fit-content] md:p-4 md:justify-between md:flex-row`}
              >
                {selectedImage ? (
                  <div className="md:max-w-[100px]">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="rounded-full aspect-square"
                    />
                  </div>
                ) : companyId ? (
                  <div className="md:max-w-[100px]">
                    <img
                      src={urlUpdate}
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
                      <div
                        className={
                          "grid w-full max-w-sm items-center gap-1.5 p-3 rounded-lg"
                        }
                      >
                        <Label
                          htmlFor="fileInput"
                          className={"inline-flex items-center cursor-pointer"}
                        >
                          <Upload className="h-4 w-4 mr-2 stroke-foreground" />
                          <span className="whitespace-nowrap">
                            Elija la imagen
                          </span>
                        </Label>
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
                      </div>
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
                <FormItem className="relative">
                  <FormLabel>RUC</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Numero de RUC" />
                  </FormControl>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-6 right-0"
                    onClick={getRucData}
                  >
                    <Search className="shrink-0 stroke-primary" />
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
                    <Input {...field} />
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
                    <Input placeholder="EIRL, SAC, SA, etc." {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_direction_fiscal"
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
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Usuario{" "}
                    <span className="text-gray-400 text-xs">(SUNAT)</span>
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
              name="key"
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

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Id{" "}
                    <span className="text-gray-400 text-xs">(API SUNAT)</span>
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
              name="client_secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Secret{" "}
                    <span className="text-gray-400 text-xs">(API SUNAT)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="!mt-3 !justify-between gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button type="submit" disabled={submitting}>
                {submitting
                  ? `${type === "create" ? "Creando" : "Actualizando"}`
                  : `${type === "create" ? "Crear" : "Actualizar"}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
