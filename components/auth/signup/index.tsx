"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupSchema } from "@/lib/validations/auth/signup";
import { useToggle } from "@/lib/hooks/use-toggle";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function SignUp() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
  }

  const [showPassword, togglePassword] = useToggle();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="placeholder:text-neutral-300 bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="placeholder:text-neutral-300 bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="correo@gmail.com"
                    {...field}
                    className="placeholder:text-neutral-300 bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    {...field}
                    className="placeholder:text-neutral-300 bg-white"
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <Button
                  type="button"
                  size={"icon"}
                  variant={"ghost"}
                  className="absolute right-0 top-6"
                  onClick={togglePassword}
                >
                  <span className="sr-only">Show password</span>
                  {showPassword ? (
                    <EyeOffIcon className="stroke-neutral-500" />
                  ) : (
                    <EyeIcon className="stroke-neutral-500" />
                  )}
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    {...field}
                    className="placeholder:text-neutral-300 bg-white"
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full !mt-4">
            Continuar
          </Button>
        </form>
      </Form>
    </>
  );
}
