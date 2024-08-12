"use client";

import { useState } from "react";
import MultipleSelector, { Option } from "../ui-custom/multiple-select";
import { Button } from "../ui/button";
import { useLabels } from "@/hooks/useLabels";
import { useToast } from "../ui/use-toast";
import { LabelSchemaIN } from "@/lib/validations/label";

export function MultipleSelect({
  id_product,
  savedLabels,
  getProductDetails,
}: {
  id_product: string;
  savedLabels: LabelSchemaIN[];
  getProductDetails: () => Promise<void>;
}) {
  const [value, setValue] = useState<Option[]>([]);
  const { labels, assignLabelToProduct, setAssignLabel } = useLabels();
  const { toast } = useToast();
  const handleChange = (value: Option[]) => {
    const formated = value.map(({ value }) => Number(value));
    setAssignLabel(formated);
    setValue(value);
  };

  const currentformatToOption = labels.map(({ id, title }) => ({
    label: title,
    value: id.toString(),
  }));

  const savedformatToOption = savedLabels.map(({ id, title }) => ({
    label: title,
    value: id.toString(),
  }));

  const filteredArray = currentformatToOption.filter(
    (item2) =>
      !savedformatToOption.some(
        (item1) => item1.label === item2.label && item1.value === item2.value
      )
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await assignLabelToProduct({ id_product, getProductDetails });
      toast({
        variant: "success",
        title: `Se asignó la etiqueta`,
      });
      setValue([]);
    } catch (e) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al asignar etiqueta`,
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form
        onSubmit={onSubmit}
        className="flex justify-center items-start gap-2"
      >
        <MultipleSelector
          value={value}
          onChange={handleChange}
          onSearch={async (value) => {
            const filterOptions = filteredArray.filter((option) =>
              option.label.toLowerCase().includes(value.toLowerCase())
            );

            return filterOptions;
          }}
          triggerSearchOnFocus
          placeholder="Seleccionar etiquetas"
          loadingIndicator={
            <p className="w-full text-sm text-center leading-10 text-muted-foreground">
              Loading...
            </p>
          }
          emptyIndicator={
            <p className="w-full text-sm text-center leading-10 text-muted-foreground">
              No results found.
            </p>
          }
          hidePlaceholderWhenSelected
        />
        <Button>Agregar</Button>
      </form>
    </div>
  );
}
