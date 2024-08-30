"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { creditNoteSchemaCreate } from "@/lib/validations/receipt-forms/bill";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/context/user-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  CalendarIcon,
  ListCollapse,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PEN, USD } from "@/constants/currency";
import { useAllSuppliers } from "@/hooks/useAllSuppliers";
import { es } from "date-fns/locale";
import { CONTADO } from "@/constants/type-payments";
import { backend_url } from "@/constants/config";
import { useMeasure } from "@/hooks/useMeause";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { createCreditNote } from "@/lib/actions/bill.actions";
import { useCompanySession } from "@/context/company-context";
import { CreditNoteView } from "./credit-note-view";
import { useDocumentsOfSupplier } from "@/hooks/useDocumentsOfSupplier";
import { CodeDocumentField } from "../code-document-field";
import { SupplierFieldForCreditNote } from "../Supplier-field-credit-note";

export function CreditNoteForm() {
  const form = useForm<z.infer<typeof creditNoteSchemaCreate>>({
    resolver: zodResolver(creditNoteSchemaCreate),
    defaultValues: {
      code: "",
      note: "",
      currency_code: PEN,
    },
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();

  async function onSubmit(values: z.infer<typeof creditNoteSchemaCreate>) {
    setSubmitting(true);
    try {
      await createCreditNote({
        jsonData: values,
        tokenBack,
        ruc: company?.ruc,
      });
      toast({
        variant: "success",
        title: `Se creó correctamente la factura`,
      });
      // form.reset();
    } catch (e) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al crear la factura intenta otra vez.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const getTC = async () => {
    try {
      const res = await fetch(`${backend_url}/api/sunat/currency-rate-dollar`, {
        method: "GET",
      });
      const data = await res.json();

      if (data.error) {
        throw new Error("Failed to fetch TC");
      }

      form.setValue("exchange_rate", data.payload.selling);
    } catch (error) {
      console.error("Error to fetch data TC", error);
    }
  };

  const { measure } = useMeasure();
  const filteredUnits = measure.filter((measure) => measure !== "");
  const { totalSuppliers } = useAllSuppliers();
  const { receipts, setIdSupplier } = useDocumentsOfSupplier();
  return (
    <TabsContent
      value="credit_note"
      className="flex gap-3 justify-start items-start"
    >
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex gap-2 items-center">
            <BookOpen className="w-6 h-6" />
            Terminos de nota de crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <section>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-2"
                autoComplete="off"
              >
                <SupplierFieldForCreditNote
                  form={form}
                  totalSuppliers={totalSuppliers}
                  setIdSupplier={setIdSupplier}
                />
                <CodeDocumentField form={form} receipts={receipts} />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nro. de comprobante</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de emisión</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Escoge una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1990-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <span className="col-span-2 text-xl font-semibold flex items-center gap-2 mt-5">
                  <ListCollapse className="w-6 h-6" />
                  Detalles de factura
                </span>
                <div className="col-span-2 grid grid-cols-5 gap-2">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: PEN, label: "PEN / Soles" },
                              { value: USD, label: "USD" },
                            ].map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("currency_code") === PEN ? null : (
                    <FormField
                      control={form.control}
                      name="exchange_rate"
                      render={({ field }) => (
                        <FormItem className="w-full relative">
                          <FormLabel>Tipo de cambio</FormLabel>
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
                            <span className="sr-only">
                              Buscar Tipo de cambio
                            </span>
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <div className="grid grid-cols-5 col-span-2 gap-2 text-sm mt-2">
                  <p className="col-span-2">Descripción</p>
                  <p>Cantidad</p>
                  <p>Medida</p>
                  <p>Precio</p>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="col-span-5 gap-2 relative group grid grid-cols-5"
                    >
                      <div className="absolute top-0 -left-10 flex flex-col justify-center group-hover:opacity-100 opacity-0 transition-opacity">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4 stroke-destructive" />
                          <span className="sr-only">Borrar producto</span>
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`products.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${index}.unit_measure`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filteredUnits.map((measure) => (
                                  <SelectItem key={measure} value={measure}>
                                    {measure}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input {...field} className="pl-8" />
                            </FormControl>
                            {form.getValues("currency_code") === PEN ? (
                              <div className="text-sm opacity-50 absolute top-[7px] left-3 font-normal">
                                S/.
                              </div>
                            ) : (
                              <div className="text-sm opacity-50 absolute top-[7px] left-4 font-normal">
                                $
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-primary w-fit hover:text-primary/80 hover:bg-transparent col-span-2"
                    onClick={() =>
                      append({
                        amount: "",
                        unit_measure: "",
                        title: "",
                        price: "",
                      })
                    }
                  >
                    <Plus className="w-4 h-4 stroke-primary" />
                    Agregar producto
                  </Button>
                </div>
                <div className="flex mt-6 justify-between col-span-2">
                  <div />
                  <Button type="submit" className="px-14" disabled={submitting}>
                    Crear Factura
                  </Button>
                </div>
              </form>
            </Form>
          </section>
        </CardContent>
      </Card>

      <CreditNoteView form={form} totalSuppliers={totalSuppliers} />
    </TabsContent>
  );
}
