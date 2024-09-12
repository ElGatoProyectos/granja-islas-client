"use client";

import { useDateRange } from "@/hooks/useDateRange";
import { useSyncSunat } from "@/hooks/useSyncSunat";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCompanySession } from "@/context/company-context";
import { LabelForm } from "@/components/settings/label-form";
import { BankForm } from "@/components/settings/bank-form";

export default function Page() {
  const { company } = useCompanySession();

  const startYear = company?.emisor_electronico_desde
    ? new Date(company.emisor_electronico_desde).getFullYear().toString()
    : "";

  const {
    selectedYearStart,
    selectedMonthStart,
    selectedYearEnd,
    selectedMonthEnd,
    availableYears,
    getAvailableMonths,
    setSelectedYearStart,
    setSelectedMonthStart,
    setSelectedYearEnd,
    setSelectedMonthEnd,
  } = useDateRange(startYear);

  const {
    syncSunatperMonth,
    loading,
    setYearStart,
    setMonthStart,
    setYearEnd,
    setMonthEnd,
  } = useSyncSunat();

  const handleYearStartChange = (year: string) => {
    setSelectedYearStart(year);
    setYearStart(year);
    if (
      year === new Date().getFullYear().toString() &&
      parseInt(selectedMonthStart, 10) > new Date().getMonth() + 1
    ) {
      setSelectedMonthStart((new Date().getMonth() + 1).toString());
      setMonthStart((new Date().getMonth() + 1).toString());
    }
  };

  const handleMonthStartChange = (month: string) => {
    setSelectedMonthStart(month);
    setMonthStart(month);
  };

  const handleYearEndChange = (year: string) => {
    setSelectedYearEnd(year);
    setYearEnd(year);
    if (
      year === new Date().getFullYear().toString() &&
      parseInt(selectedMonthEnd, 10) > new Date().getMonth() + 1
    ) {
      setSelectedMonthEnd((new Date().getMonth() + 1).toString());
      setMonthEnd((new Date().getMonth() + 1).toString());
    }
  };

  const handleMonthEndChange = (month: string) => {
    setSelectedMonthEnd(month);
    setMonthEnd(month);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
            <div className="flex flex-col gap-2 justify-center items-center my-2">
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
                    <Select
                      value={selectedYearStart}
                      onValueChange={handleYearStartChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Año</SelectLabel>
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedMonthStart}
                      onValueChange={handleMonthStartChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mes</SelectLabel>
                          {getAvailableMonths(selectedYearStart).map(
                            (month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold">Fin del periodo</p>
                  <div className="flex gap-2 mt-2">
                    <Select
                      value={selectedYearEnd}
                      onValueChange={handleYearEndChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Año</SelectLabel>
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedMonthEnd}
                      onValueChange={handleMonthEndChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mes</SelectLabel>
                          {getAvailableMonths(selectedYearEnd).map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
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
            productos en las facturas.
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
            Gestiona y visualiza información sobre tus bancos asociados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BankForm />
        </CardContent>
      </Card>
    </section>
  );
}
