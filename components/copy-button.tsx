import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CopyButtom({ copytext }: { copytext: string }) {
  const [copied, setCopied] = useState("");

  const handleCopy = () => {
    setCopied(copytext);
    navigator.clipboard.writeText(copytext);
    setTimeout(() => {
      setCopied("");
    }, 800);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className="rounded-md h-7 w-7"
    >
      {copied === copytext ? (
        <Check className="h-4" />
      ) : (
        <Copy className="h-4" />
      )}
    </Button>
  );
}
