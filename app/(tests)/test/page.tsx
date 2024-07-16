"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formdata);
    console.log(fields);
  }

  return (
    <section>
      <div className="border border-gray-200 p-2 w-full rounded-xl flex justify-between items-center">
        <h1 className="font-bold text-xl pl-6">Formulario</h1>
        <Button form="contact-form">Enviar</Button>
        {/* ---- No es necesario que el button este dentro del form ----*/}
      </div>
      <form
        id="contact-form"
        onSubmit={handleSubmit}
        autoComplete="off"
        className="max-w-[600px]"
      >
        <Label>
          Nombre <Input type="text" name="name" required />
        </Label>
        <Label>
          Apellido <Input type="text" name="lastName" required />
        </Label>
      </form>
    </section>
  );
}
