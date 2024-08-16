"use client";

import { BankForm } from "@/components/settings/bank-form";
import { LabelForm } from "@/components/settings/label-form";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/constants/dates";
import { useSyncSunat } from "@/hooks/useSyncSunat";
import { Loader2 } from "lucide-react";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const years = [
  {
    label: `${currentYear}`,
    value: `${currentYear}`,
  },
  {
    label: `${currentYear - 1}`,
    value: `${currentYear - 1}`,
  },
];

export default function Page() {
  const {
    setYearStart,
    yearStart,
    loading,
    syncSunatperMonth,
    monthStart,
    setMonthStart,
    monthEnd,
    setMonthEnd,
    setYearEnd,
    yearEnd,
  } = useSyncSunat();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await syncSunatperMonth();
  };

  return (
    <section className="grid grid-cols-2 gap-6">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-center">
            Sincronización con SUNAT
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {loading ? (
            <div className=" flex flex-col gap-2 justify-center items-center my-2">
              <p className="text-muted-foreground w-[40ch] text-center">
                Por favor, espere mientras se sincronizan los datos. No cierre
                la ventana
              </p>
              <div className="text-muted-foreground flex gap-2 justify-center items-center my-2">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sincronizando datos...
              </div>
            </div>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <div className="w-full">
                  <p className="text-sm font-semibold">Inicio del periodo</p>
                  <div className="flex gap-2 mt-2">
                    <Select value={yearStart} onValueChange={setYearStart}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Año</SelectLabel>
                          {years.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={monthStart} onValueChange={setMonthStart}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mes</SelectLabel>
                          {months.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold">Fin del periodo</p>
                  <div className="flex gap-2 mt-2">
                    <Select value={yearEnd} onValueChange={setYearEnd}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Año</SelectLabel>
                          {years.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={monthEnd} onValueChange={setMonthEnd}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mes</SelectLabel>
                          {months.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="w-60">Sincronizar</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Etiqueta de productos</CardTitle>
          <CardDescription>
            Asigna etiquetas para facilitar la búsqueda y organización de tus
            productos en las facturas. Agrega términos que describan la
            categoría para crear filtros personalizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LabelForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Bancos</CardTitle>
          <CardDescription>
            Gestiona y visualiza información sobre tus bancos asociados. Agrega
            nuevas etiquetas para clasificar y organizar tus datos de manera
            eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BankForm />
        </CardContent>
      </Card>
    </section>
  );
}
