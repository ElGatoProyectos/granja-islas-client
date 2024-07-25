export function LayerPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className="text-2xl md:text-3xl font-bold ml-8 mb-6">{title}</h1>
      {children}
    </section>
  );
}
