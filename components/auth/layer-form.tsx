export function LayerForm({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-dvh flex justify-center items-center">
      <section className="flex flex-col max-w-[500px] sm:p-12  gap-y-4 rounded-xl relative shadow-lg">
        <div className="absolute -top-20 sm:-top-12 sm:left-12">
          <div className="bg-primary flex justify-center items-center px-8 sm:px-10 py-3 pr-28 sm:pr-32 rounded-t-lg">
            <span className="text-white text-xs sm:text-base text-balance">
              Creado por <span className="font-semibold">Agencia Gato</span>
            </span>
          </div>
          <img
            src="/assets/gatologo.png"
            alt="gato-logo"
            className="absolute -top-9 right-2 sm:-right-2 sm:-top-11 h-[135px]"
          />
        </div>
        {children}
      </section>
    </section>
  );
}
