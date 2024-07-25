"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/lib/validations/auth/signin";
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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToggle } from "@/hooks/use-toggle";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function SignIn() {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!res?.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Ocurrio un error.",
          description: "Verifica tus credenciales.",
        });
        return;
      }

      toast({
        variant: "success",
        title: "Has iniciado sessión",
      });

      router.push("/onboarding");
    } catch (e) {
      console.log("error al iniciar session", e);
    }
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="correo@gmail.com" {...field} />
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
          <Button type="submit" className="w-full !mt-4">
            Continuar
          </Button>
        </form>
      </Form>
    </>
  );
}
