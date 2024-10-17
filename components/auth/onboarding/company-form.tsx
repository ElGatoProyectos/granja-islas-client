"use client";

import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKEND_URL } from "@/constants/config";
import { SUPERADMIN } from "@/constants/roles";
import { useUserInfo } from "@/context/user-context";
import { useToggle } from "@/hooks/use-toggle";
import { createCompany, updateCompany } from "@/lib/actions/company.actions";
import {
  CompanySchemaIN,
  CreateCompanySchema,
  createCompanySchema,
} from "@/lib/validations/auth/company";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Image as AddImage,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CodeCountry } from "./code-country";

interface Props {
  type: "create" | "edit";
  company?: CompanySchemaIN;
  companyId?: number;
}

export function CompanyForm({ type, company, companyId }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
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

  const { userInfo, tokenBack } = useUserInfo();

  async function onSubmit(values: z.infer<typeof createCompanySchema>) {
    setSubmitting(true);
    const { image, ...company } = values;

    const trimmedCompany = {
      ...company,
      ruc: company.ruc.trim(),
      business_name: company.business_name.trimStart(),
      user: company.user.trim(),
      key: company.key.trim(),
      client_id: company.client_id.trim(),
      client_secret: company.client_secret.trim(),
    };
    const formData = new FormData();

    if (image) {
      formData.append("company-profile", image[0]);
    }

    type CompanyWithoutKey = Omit<CreateCompanySchema, "image">;
    for (const key in trimmedCompany) {
      if (trimmedCompany.hasOwnProperty(key)) {
        formData.append(key, trimmedCompany[key as keyof CompanyWithoutKey]);
      }
    }

    try {
      if (type === "create") {
        await createCompany({ formData, tokenBack: tokenBack });
      }

      if (type === "edit") {
        await updateCompany({
          companyId,
          formData,
          tokenBack: tokenBack,
        });
      }

      toast.success(
        `Se ${type === "create" ? "creó" : "editó"} correctamente la empresa`
      );

      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      toast.error(
        `Ocurrio un error al ${
          type === "create" ? "crear" : "editar"
        } la empresa, intenta otra vez.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  const urlUpdate = `${BACKEND_URL}/api/companies/file/${companyId}`;
  const [loadingDataOfRuc, setLoadingDataOfRuc] = useState(false);

  const getRucData = async () => {
    const ruc = form.watch("ruc");
    if (!ruc) return;
    setLoadingDataOfRuc(true);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/sunat/ruc/v2/${ruc.trimStart()}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${tokenBack}` },
        }
      );

      if (!res.ok) {
        toast.error(`Ocurrio un error al buscar por ruc, intenta otra vez.`);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();

      if (data.error) {
        toast.error(`Ocurrio un error al buscar por ruc, intenta otra vez.`);
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
      toast.success(`Se encontraron datos con ese ruc`);
    } catch (error) {
      toast.error(`Ocurrio un error al buscar por ruc, intenta otra vez.`);
    } finally {
      setLoadingDataOfRuc(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [showPassword, togglePassword] = useToggle();

  return (
    userInfo?.role === SUPERADMIN && (
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
        <DialogContent className="sm:max-w-[800px]">
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
                        className="rounded-full aspect-square object-cover"
                      />
                    </div>
                  ) : companyId ? (
                    <div className="md:max-w-[100px]">
                      <img
                        src={urlUpdate}
                        alt="Selected"
                        className="rounded-full aspect-square object-cover"
                      />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-between">
                      <div className="p-7 bg-muted justify-center items-center flex rounded-full">
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
                            className={
                              "inline-flex items-center cursor-pointer"
                            }
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
                            disabled={submitting || loadingDataOfRuc}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  name="business_direction_fiscal"
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
                            disabled={submitting || loadingDataOfRuc}
                          />
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
                  name="key"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>
                        Clave SOL{" "}
                        <span className="text-gray-400 text-xs">(SUNAT)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={submitting || loadingDataOfRuc}
                          type={showPassword ? "text" : "password"}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"ghost"}
                        className="absolute right-0 top-6"
                        onClick={togglePassword}
                      >
                        <span className="sr-only">Show password</span>
                        {showPassword ? (
                          <EyeOffIcon className="stroke-neutral-500" />
                        ) : (
                          <EyeIcon className="stroke-neutral-500" />
                        )}
                      </Button>
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
                        <span className="text-gray-400 text-xs">
                          (API SUNAT)
                        </span>
                      </FormLabel>
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
                  name="client_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Secret{" "}
                        <span className="text-gray-400 text-xs">
                          (API SUNAT)
                        </span>
                      </FormLabel>
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

                <DialogFooter className="!mt-3 !justify-between gap-2 col-span-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={submitting || loadingDataOfRuc}
                  >
                    {submitting
                      ? `${
                          type === "create"
                            ? "Creando Empresa"
                            : "Actualizando Empresa"
                        }`
                      : `${
                          type === "create"
                            ? "Crear Empresa"
                            : "Actualizar Empresa"
                        }`}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}
