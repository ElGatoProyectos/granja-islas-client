import type { Metadata } from "next";
import "../globals.css";
import { TopBar } from "@/components/shared/top-bar";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { DatesFilterProvider } from "@/context/dates-filter-context";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DatesFilterProvider>
      <div className="flex flex-row">
        <LeftSidebar />
        <div className="flex min-h-dvh flex-1 flex-col items-center p-6 pb-8">
          <TopBar />
          <div className="w-full">{children}</div>
        </div>
      </div>
    </DatesFilterProvider>
  );
}
