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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeCountry } from "../auth/onboarding/code-country";
import { userSchema } from "@/lib/validations/user";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon, Plus } from "lucide-react";
import { useToggle } from "@/hooks/use-toggle";
import { ADMIN, USER } from "@/constants/roles";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useUserInfo } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { UserTypeIn } from "@/types";
import { createUser, updateUser } from "@/lib/actions/users.actions";

interface Props {
  type: "create" | "edit";
  userInfo?: UserTypeIn;
}

export function UserForm({ type, userInfo }: Props) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userInfo?.name ?? "",
      last_name: userInfo?.last_name ?? "",
      email: userInfo?.email ?? "",
      role: userInfo?.role ?? USER,
      country_code: userInfo?.country_code ?? "",
      phone: userInfo?.phone ?? "",
      password: "",
      confirmPassword: "",
    },
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { tokenBack } = useUserInfo();
  const route = useRouter();

  async function onSubmit(values: z.infer<typeof userSchema>) {
    console.log(values);
    setSubmitting(true);
    const { image, confirmPassword, ...userFormInfo } = values;
    const formData = new FormData();
    if (image) {
      formData.append("company-profile", image[0]);
    }

    type userFormInfoWithoutKey = Omit<UserTypeIn, "id">;
    for (const key in userFormInfo) {
      if (userFormInfo.hasOwnProperty(key)) {
        formData.append(key, userFormInfo[key as keyof userFormInfoWithoutKey]);
      }
    }

    formData.append("dni", "123456789");

    try {
      if (type === "create") {
        await createUser({ formData, tokenBack });
      }

      if (type === "edit") {
        await updateUser({
          userId: userInfo?.id,
          formData,
          tokenBack,
        });
      }

      toast({
        variant: "success",
        title: `Se ${
          type === "create" ? "creó" : "editó"
        } correctamente el usuario`,
      });
      route.refresh();
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: `Ocurrio un error al ${
          type === "create" ? "crear" : "editar"
        } el usuario, intenta otra vez.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const [showPassword, togglePassword] = useToggle();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Crear Usuario
          </Button>
        ) : (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            {type === "create" ? "Nuevo" : "Editar"} Usuario
          </DialogTitle>
          <DialogDescription>
            Es importante asegurarse de que la información sea precisa y esté
            actualizada para mantener una comunicación efectiva y el correcto
            funcionamiento del sistema.
          </DialogDescription>
        </DialogHeader>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <div className="flex">
                    <CodeCountry form={form} />
                    <FormControl className="ml-2">
                      <Input
                        {...field}
                        type="tel"
                        // universal input options
                        autoComplete="off"
                        autoCorrect="off"
                        inputMode="numeric"
                      />
                    </FormControl>
                  </div>
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
                      {...field}
                      placeholder="*******"
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
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
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
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*******"
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={USER}>Usuario</SelectItem>
                        <SelectItem value={ADMIN}>Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="!mt-6 !justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                {type === "create" ? "Registrar" : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
