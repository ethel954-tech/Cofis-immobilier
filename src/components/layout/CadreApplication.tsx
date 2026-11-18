import type { ReactNode } from "react";
import { NavigationLaterale } from "@/components/navigation/NavigationLaterale";
import { EnteteApplication } from "@/components/navigation/EnteteApplication";

export function CadreApplication({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] md:flex">
      <div className="hidden md:fixed md:inset-y-0 md:flex">
        <NavigationLaterale />
      </div>
      <div className="min-w-0 flex-1 md:pl-[264px]">
        <EnteteApplication />
        <main className="mx-auto min-h-[calc(100vh-76px)] max-w-[1600px] px-5 py-7 md:px-8 md:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
