import { LayerForm } from "@/components/auth/layer-form";
import { SignUp } from "@/components/auth/signup";

export default function Page() {
  return (
    <LayerForm>
      <header className="flex flex-col">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">Registrate</h1>
        <p className="text-gray-500 leading-tight text-sm mt-2">
          Completa el formulario para crear tu cuenta y empezar a disfrutar de
          nuestros servicios.
        </p>
      </header>
      <SignUp />
    </LayerForm>
  );
}
