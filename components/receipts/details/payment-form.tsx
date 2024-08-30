"use client";

import {
  createPaymentSchema,
  PaymentSchemaIN,
} from "@/lib/validations/payment";
import { MutableRefObject, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/context/user-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { backend_url } from "@/constants/config";
import { Image as AddImage, Search, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBanks } from "@/hooks/useBanks";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { createPayment } from "@/lib/actions/payment.actions";
import { useCompanySession } from "@/context/company-context";
import { PEN } from "@/constants/currency";
import { io, Socket } from "socket.io-client";

interface Props {
  type: "create" | "edit";
  document_code: string;
  document_id: string;
  getReceiptPayments: () => void;
}

export function PaymentForm({
  type,
  document_code,
  document_id,
  getReceiptPayments,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      amount_original: "",
      bank_id: "",
      operation_number: "",
      type_currency: "PEN",
      exchange_rate: "",
    },
  });
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const socket: MutableRefObject<Socket | undefined> = useRef();
  async function onSubmit(values: z.infer<typeof createPaymentSchema>) {
    setSubmitting(true);

    if (form.getValues("type_currency") === PEN) {
      values.exchange_rate = "1";
    }

    const { voucher, ...payment } = values;
    const formData = new FormData();
    if (voucher) {
      formData.append("voucher", voucher[0]);
    }

    type PaymentWithoutKey = Omit<PaymentSchemaIN, "id">;
    for (const key in payment) {
      if (payment.hasOwnProperty(key)) {
        formData.append(key, payment[key as keyof PaymentWithoutKey]);
      }
    }

    formData.append("document_code", document_code);
    formData.append("document_id", document_id);

    try {
      if (type === "create") {
        await createPayment({
          formData,
          tokenBack,
          ruc: company?.ruc,
        });

        socket.current = io(`${backend_url}`);
        socket.current.emit("create-voucher", {
          ruc: company?.ruc,
          token: `Bearer ${tokenBack}`,
        });
      }
      if (type === "edit") {
      }
      toast({
        variant: "success",
        title: `Se ${
          type === "create" ? "creó" : "editó"
        } correctamente el voucher`,
      });
      form.reset();
      getReceiptPayments();
      setSelectedImage(null);
    } catch (e) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al ${
          type === "create" ? "crear" : "editar"
        } el voucher, intenta otra vez.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const { banks } = useBanks();
  const getTC = async () => {
    try {
      const res = await fetch(`${backend_url}/api/sunat/currency-rate-dollar`, {
        method: "GET",
      });
      const data = await res.json();

      if (data.error) {
        throw new Error("Failed to fetch TC");
      }

      form.setValue("exchange_rate", data.payload.selling.toString());
    } catch (error) {
      console.error("Error to fetch data TC", error);
    }
  };

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
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
              name="voucher"
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
            name="operation_number"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nro. de Operacion</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {banks.length ? (
            <FormField
              control={form.control}
              name="bank_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Banco</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks.map(({ id, title }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="flex items-end">
              <Link
                href={"/dashboard/settings"}
                className={buttonVariants({ variant: "link" })}
              >
                Agregar Banco
              </Link>
            </div>
          )}
          <div className="w-full flex gap-2">
            <FormField
              control={form.control}
              name="type_currency"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Moneda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["PEN", "USD"].map((moneda) => (
                        <SelectItem key={moneda} value={moneda}>
                          {moneda}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues("type_currency") === PEN ? null : (
              <FormField
                control={form.control}
                name="exchange_rate"
                render={({ field }) => (
                  <FormItem className="w-full relative">
                    <FormLabel>TC</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute top-6 right-0"
                      onClick={getTC}
                    >
                      <Search className="shrink-0 stroke-primary" />
                      <span className="sr-only">Buscar TC</span>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="amount_original"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" disabled={submitting}>
            Agregar
          </Button>
        </form>
      </Form>
    </section>
  );
}
