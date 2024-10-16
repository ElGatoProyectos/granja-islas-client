"use client";

import MultipleSelector, {
  Option,
} from "@/components/ui-custom/multiple-select";
import { Button } from "@/components/ui/button";
import { useCompanySession } from "@/context/company-context";
import { assignLabelToProduct } from "@/lib/actions/product";
import { TypeLabel } from "@/types/label";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getLabels } from "@/lib/actions/label.actions";
import { CirclePlus } from "lucide-react";

export function AssignLabel({
  id_product,
  labelsProduct,
  hasMoreThanThreeLabels,
}: {
  id_product: number;
  labelsProduct: TypeLabel[];
  hasMoreThanThreeLabels?: boolean;
}) {
  const [value, setValue] = useState<Option[]>([]);
  const [labelsIds, setlabelsIds] = useState<number[]>([]);
  const { company } = useCompanySession();
  const [labels, setLabels] = useState<TypeLabel[]>([]);

  const getLabelsData = useCallback(async () => {
    if (!company) return;
    try {
      const labelsData = await getLabels({ company_ruc: company.ruc });
      setLabels(labelsData);
    } catch (error) {
      console.error("Error loading suppliers", error);
    }
  }, [company]);

  useEffect(() => {
    getLabelsData();
  }, [getLabelsData]);

  const handleChange = (value: Option[]) => {
    const formated = value.map(({ value }) => Number(value));
    setlabelsIds(formated);
    setValue(value);
  };

  const currentformatToOption = labels.map(({ id, title }) => ({
    label: title,
    value: id.toString(),
  }));

  const savedformatToOption = labelsProduct.map(({ id, title }) => ({
    label: title,
    value: id.toString(),
  }));

  const filteredArray = currentformatToOption.filter(
    (item2) =>
      !savedformatToOption.some(
        (item1) => item1.label === item2.label && item1.value === item2.value
      )
  );
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company) return;
    if (!value.length) return;
    setloading(true);
    try {
      await assignLabelToProduct({
        id_product,
        label_id: labelsIds,
        ruc: company.ruc,
      });
      toast.success(`Se asignó la etiqueta`);
      setOpen(false);
      setValue([]);
    } catch (e) {
      toast.error(`Ocurrio un error al asignar etiqueta`);
    } finally {
      setloading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {hasMoreThanThreeLabels ? (
          <button onClick={() => setOpen(true)}>
            <CirclePlus className="size-4 stroke-primary" />
          </button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Etiquetar
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form
          onSubmit={onSubmit}
          className="flex justify-center items-start gap-2"
        >
          <MultipleSelector
            value={value}
            disabled={loading}
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
          <Button disabled={loading}>Agregar</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
