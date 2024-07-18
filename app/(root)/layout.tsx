import type { Metadata } from "next";
import "../globals.css";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { TopBar } from "@/components/shared/top-bar";

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
    <div className="flex flex-row">
      <LeftSidebar />
      <div className="flex min-h-dvh flex-1 flex-col items-center px-6 py-8 max-md:pb-32 sm:px-8">
        <TopBar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
