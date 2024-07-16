import { LayerForm } from "@/components/auth/layer-form";
import { SignIn } from "@/components/auth/signin";

export default function Page() {
  return (
    <LayerForm>
      <header className="flex flex-col">
        <h1 className="text-2xl sm:text-4xl font-bold">Iniciar sesión</h1>
        <p className="text-gray-500 leading-tight text-sm  mt-2">
          Bienvenido de nuevo. Por favor, ingresa tus credenciales para acceder
          a tu cuenta.
        </p>
      </header>
      <SignIn />
    </LayerForm>
  );
}
