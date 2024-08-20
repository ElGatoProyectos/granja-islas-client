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
import { billSchemaCreate } from "@/lib/validations/receipt-forms/bill";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/context/user-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
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

const proveedor = [
  {
    id: "1",
    label: "Don agusto",
  },
  {
    id: "2",
    label: "Don pedro",
  },
  {
    id: "3",
    label: "Don carlos",
  },
  {
    id: "4",
    label: "Don Jose",
  },
];

export function BillForm() {
  const form = useForm<z.infer<typeof billSchemaCreate>>({
    resolver: zodResolver(billSchemaCreate),
    defaultValues: {
      comprobante: "",
      proveedor: "",
      fecha_emision: "",
      impuestos: "",
      tipo_pago: "",
      vencimiento: "",
      notas: "",
      moneda: "",
      tipo_cambio: "",
      productos: [{ cantidad: "", medida: "", name: "", precio: "" }],
    },
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { toast } = useToast();
  const { tokenBack } = useUserInfo();

  async function onSubmit(values: z.infer<typeof billSchemaCreate>) {
    try {
      toast({
        variant: "success",
        title: `Se creó correctamente la factura`,
      });
      form.reset();
    } catch (e) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al crear la factura intenta otra vez.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control,
      name: "productos",
    }
  );

  const { totalSuppliers } = useAllSuppliers();
  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="comprobante"
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
            name="proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
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
                    {totalSuppliers.map(({ id, business_name }) => (
                      <SelectItem key={id} value={id.toString()}>
                        {business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_emision"
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Escoje una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value as unknown as Date}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impuestos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impuesto</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo_pago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de pago</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vencimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de vencimiento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span className="col-span-2">Detalles de factura</span>
          <div className="col-span-2 grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
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
              name="moneda"
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
                      {[PEN, USD].map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_cambio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de cambio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-5 col-span-2 gap-3">
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
                  name={`productos.${index}.name`}
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
                  name={`productos.${index}.cantidad`}
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
                  name={`productos.${index}.medida`}
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
                  name={`productos.${index}.precio`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                append({ cantidad: "", medida: "", name: "", precio: "" })
              }
            >
              <Plus className="w-4 h-4 stroke-primary" />
              Agregar producto
            </Button>
          </div>
          <div className="flex mt-6 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>

            <Button type="submit">Crear Factura</Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
