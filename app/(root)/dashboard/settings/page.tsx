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
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";
import { useCompanySession } from "@/context/company-context";
import { syncWithSunat } from "@/lib/actions/sync-sunat";
import { filterMonthsByYear } from "@/utils/filter-months-by-year";
import { getYearsArray } from "@/utils/getYearArray";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { company } = useCompanySession();
  const [period, setPeriod] = useState({
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
  });
  const handleSelectChange = (field: string, value: string) => {
    setPeriod((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const yearsCompany = getYearsArray({ startYear: START_YEAR_SYNC });
  const filteredStartMonths = filterMonthsByYear({
    selectedYear: period.startYear,
    yearStarted: START_YEAR_SYNC,
    monthStarted: START_MONTH_SYNC,
  });

  const filteredEndMonths = filterMonthsByYear({
    selectedYear: period.endYear,
    yearStarted: START_YEAR_SYNC,
    monthStarted: START_MONTH_SYNC,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    try {
      const data = await syncWithSunat({
        startYear: period.startYear,
        startMonth: period.startMonth,
        endYear: period.endYear,
        endMonth: period.endMonth,
        ruc: company?.ruc,
      });
      if (data.error) {
        toast.error(`${data.message}`);
        return;
      }
      toast.success(
        `La sincronización ha comenzado. Recibirás una notificación cuando el proceso haya finalizado.`
      );
    } catch (e: any) {
      toast.error(e.message || "Ocurrió un error desconocido.");
    }
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
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <div className="w-full">
                <p className="text-sm font-semibold">Inicio del periodo</p>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={period.startYear}
                    onValueChange={(value) =>
                      handleSelectChange("startYear", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Año</SelectLabel>
                        {yearsCompany.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={period.startMonth}
                    onValueChange={(value) =>
                      handleSelectChange("startMonth", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mes</SelectLabel>
                        {filteredStartMonths.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
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
                  <Select
                    value={period.endYear}
                    onValueChange={(value) =>
                      handleSelectChange("endYear", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Año</SelectLabel>
                        {yearsCompany.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={period.endMonth}
                    onValueChange={(value) =>
                      handleSelectChange("endMonth", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mes</SelectLabel>
                        {filteredEndMonths.map((month) => (
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
