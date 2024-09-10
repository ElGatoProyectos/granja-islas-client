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
import { userSchema, UserSchemaIN } from "@/lib/validations/user";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image as AddImage,
  EyeIcon,
  EyeOffIcon,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import { useToggle } from "@/hooks/use-toggle";
import { ADMIN, SUPERADMIN, USER } from "@/constants/roles";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/context/user-context";
import { createUser, updateUser } from "@/lib/actions/users.actions";
import { backend_url } from "@/constants/config";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  type: "create" | "edit";
  userInfo?: UserSchemaIN;
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
  const {
    tokenBack,
    userInfo: currentUser,
    setavatarURL,
    getUser,
  } = useUserInfo();

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setSubmitting(true);
    const { image, confirmPassword, ...userFormInfo } = values;

    const formData = new FormData();
    if (image) {
      formData.append("user-profile", image[0]);
    }

    type userFormInfoWithoutKey = Omit<UserSchemaIN, "id">;
    for (const key in userFormInfo) {
      if (userFormInfo.hasOwnProperty(key)) {
        const value = userFormInfo[key as keyof userFormInfoWithoutKey];
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      }
    }

    try {
      if (type === "create") {
        await createUser({ userFormInfo, tokenBack });
      }

      if (type === "edit") {
        await updateUser({
          userId: userInfo?.id,
          formData,
          tokenBack,
        });
        if (image) {
          setavatarURL(`${URL.createObjectURL(image[0])}`);
        }
        getUser();
      }

      toast({
        variant: "success",
        title: `Se ${
          type === "create" ? "creó" : "editó"
        } correctamente el usuario`,
      });

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Usuario
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Pencil className="stroke-primary" />
            <span className="sr-only">Editar perfil</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
            {type === "edit" && (
              <div className="flex items-center justify-center">
                <div
                  className={`flex h-[fit-content] md:p-4 md:justify-between md:flex-row`}
                >
                  {selectedImage ? (
                    <div className="md:max-w-[100px]">
                      <Avatar className={"h-[100px] w-[100px]"}>
                        <AvatarImage
                          src={URL.createObjectURL(selectedImage)}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-3xl capitalize">
                          I
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : userInfo?.id ? (
                    <div className="md:max-w-[100px]">
                      <Avatar className={"h-[100px] w-[100px]"}>
                        <AvatarImage
                          src={`${backend_url}/api/users/file/${userInfo?.id}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-3xl capitalize">
                          {userInfo.name.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-between">
                      <div className="p-7 bg-muted justify-center items-center flex rounded-full">
                        <AddImage className="stroke-foreground" />
                      </div>
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          className={
                            "grid w-full max-w-sm items-center gap-1.5 p-3 rounded-lg"
                          }
                        >
                          <Label
                            htmlFor="fileInput"
                            className={
                              "inline-flex items-center cursor-pointer"
                            }
                          >
                            <Upload className="h-4 w-4 mr-2 stroke-foreground" />
                            <span className="whitespace-nowrap">
                              Elija la imagen
                            </span>
                          </Label>
                          <Input
                            type="file"
                            className="hidden"
                            id="fileInput"
                            accept="image/*"
                            onBlur={field.onBlur}
                            name={field.name}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setSelectedImage(e.target.files?.[0] || null);
                            }}
                            ref={field.ref}
                            disabled={submitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={submitting} />
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
                    <Input {...field} disabled={submitting} />
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
                  <FormLabel>Correo Electronico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="correo@gmail.com"
                      {...field}
                      disabled={submitting}
                    />
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
                    <CodeCountry form={form} disabled={submitting} />
                    <FormControl className="ml-2">
                      <Input
                        {...field}
                        type="tel"
                        // universal input options
                        autoComplete="off"
                        autoCorrect="off"
                        inputMode="numeric"
                        disabled={submitting}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(currentUser?.role === SUPERADMIN ||
              currentUser?.role === ADMIN) &&
              type === "create" && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                          disabled={submitting}
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
              )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>
                    {type === "edit" ? "Nueva Contraseña" : "Contraseña"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*******"
                      type={showPassword ? "text" : "password"}
                      disabled={submitting}
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
                  <FormLabel>
                    {type === "edit"
                      ? "Confirmar Nueva Contraseña"
                      : "Confirmar contraseña"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*******"
                      type={showPassword ? "text" : "password"}
                      disabled={submitting}
                    />
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
              <Button type="submit" disabled={submitting}>
                {type === "create" ? "Registrar" : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
