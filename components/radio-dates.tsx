"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const dates = [
  {
    value: new Date(new Date().setMonth(new Date().getMonth() - 1)).toString(), // 1 month ago
    label: "1M",
  },
  {
    value: new Date(new Date().setMonth(new Date().getMonth() - 6)).toString(), // 6 months ago
    label: "6M",
  },
  {
    value: new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    ).toString(), // 1 year ago
    label: "1A",
  },
];

export function RadioDates() {
  const [radio, setRadio] = useState(dates[0].value);

  return (
    <RadioGroup
      className="grid-cols-3 gap-1"
      value={radio}
      onValueChange={setRadio}
    >
      {dates.map(({ value, label }) => (
        <div key={label} className="flex items-center justify-center">
          <RadioGroupItem value={value} id={label} className="sr-only" />
          <Label htmlFor={label}>
            <Badge
              variant={radio === value ? "default" : "outline"}
              className="px-5 py-[5px] text-sm"
            >
              {label}
            </Badge>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
