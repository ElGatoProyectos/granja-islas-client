"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dispatch, SetStateAction, useId } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  radio: string;
  setRadio: Dispatch<SetStateAction<string>>;
  dates: { value: string; label: string }[];
}
export function RadioDates({ setRadio, radio, dates }: Props) {
  const handleValue = (value: string) => {
    setRadio(value);
  };

  return (
    <RadioGroup
      className="grid-cols-3 gap-1"
      value={radio}
      onValueChange={setRadio}
    >
      {dates.map(({ value, label }) => (
        <div key={label} className="flex items-center justify-center ">
          <RadioGroupItem value={value} id={label} className="sr-only" />
          <Label htmlFor={label} className="cursor-pointer">
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

    // <RadioGroup
    //   value={value}
    //   onValueChange={handleValue}
    //   className="grid grid-cols-3 gap-4"
    // >
    //   {dates.map(({ value, label }) => (
    //     <div key={label}>
    //       <RadioGroupItem value={value} id={label} className="peer sr-only" />
    //       <Label
    //         htmlFor={label}
    //         className="cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    //       >
    //         <Badge
    //           variant={radio === value ? "default" : "outline"}
    //           className="px-5 py-[5px] text-sm"
    //         >
    //           {label}
    //         </Badge>
    //       </Label>
    //     </div>
    //   ))}
    //   <div>
    //     <RadioGroupItem
    //       value="card"
    //       id="card"
    //       className="peer sr-only"
    //       aria-label="Card"
    //     />
    //     <Label
    //       htmlFor="card"
    //       className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    //     >
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         viewBox="0 0 24 24"
    //         fill="none"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         className="mb-3 h-6 w-6"
    //       >
    //         <rect width="20" height="14" x="2" y="5" rx="2" />
    //         <path d="M2 10h20" />
    //       </svg>
    //       Card
    //     </Label>
    //   </div>

    //   <div>
    //     <RadioGroupItem
    //       value="paypal"
    //       id="paypal"
    //       className="peer sr-only"
    //       aria-label="Paypal"
    //     />
    //     <Label
    //       htmlFor="paypal"
    //       className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    //     >
    //       Paypal
    //     </Label>
    //   </div>

    //   <div>
    //     <RadioGroupItem
    //       value="apple"
    //       id="apple"
    //       className="peer sr-only"
    //       aria-label="Apple"
    //     />
    //     <Label
    //       htmlFor="apple"
    //       className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    //     >
    //       Apple
    //     </Label>
    //   </div>
    // </RadioGroup>
  );
}
