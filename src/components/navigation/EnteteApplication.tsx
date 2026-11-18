"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const titresPages: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/proprietaires": "Propriétaires",
  "/immeubles": "Immeubles",
  "/unites": "Unités / Logements",
  "/locataires": "Locataires",
  "/baux": "Baux",
  "/echeances": "Échéances",
  "/paiements": "Paiements",
  "/impayes": "Impayés",
  "/depenses": "Dépenses",
  "/reversements": "Reversements",
  "/rapports": "Rapports",
  "/parametres": "Paramètres",
};

export function EnteteApplication() {
  const cheminActuel = usePathname();
  const titre = titresPages[cheminActuel] ?? "Espace COFIS";

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur md:px-8">
      <div>
        <p className="text-[11px] font-medium text-slate-400">Espace de travail / COFIS</p>
        <h1 className="mt-1 text-[15px] font-bold text-slate-900">{titre}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button type="button" aria-label="Recherche (bientôt disponible)" disabled className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs text-slate-400 sm:flex">
          <Search size={15} /> Recherche
          <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px]">⌘ K</span>
        </button>
        <button type="button" aria-label="Notifications (bientôt disponibles)" disabled className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400">
          <Bell size={18} />
        </button>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <button type="button" disabled aria-label="Profil utilisateur (authentification non configurée)" className="flex items-center gap-2 opacity-70">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">CF</span>
          <span className="hidden text-left sm:block"><span className="block text-xs font-semibold text-slate-700">Compte COFIS</span><span className="block text-[10px] text-slate-400">Non connecté</span></span>
          <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
