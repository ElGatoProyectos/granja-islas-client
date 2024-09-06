import { cn } from "@/lib/utils";

export function LayerPage({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section>
      <h1 className={cn("text-2xl md:text-3xl font-bold mb-6", className)}>
        {title}
      </h1>
      {children}
    </section>
  );
}
