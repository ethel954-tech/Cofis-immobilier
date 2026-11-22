"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";

const titresPages: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/proprietaires": "Propriétaires",
  "/immeubles": "Immeubles",
  "/unites": "Unités / Logements",
  "/locataires": "Locataires",
  "/baux": "Baux",\n  "/maintenance": "Maintenance",
  "/echeances": "Échéances",
  "/paiements": "Paiements",
  "/impayes": "Impayés",
  "/depenses": "Dépenses",
  "/reversements": "Reversements",
  "/rapports": "Rapports",
  "/parametres": "Paramètres",
};

const liensMobiles = [
  { libelle: "Vue d'ensemble", href: "/dashboard", groupe: "Général" },
  { libelle: "Propriétaires", href: "/proprietaires", groupe: "Patrimoine" },
  { libelle: "Immeubles", href: "/immeubles", groupe: "Patrimoine" },
  { libelle: "Unités / Logements", href: "/unites", groupe: "Patrimoine" },
  { libelle: "Locataires", href: "/locataires", groupe: "Location" },
  { libelle: "Baux", href: "/baux", groupe: "Location" },\n  { libelle: "Maintenance", href: "/maintenance", groupe: "Patrimoine" },
  { libelle: "Paiements", href: "/paiements", groupe: "Finance" },
  { libelle: "Dépenses", href: "/depenses", groupe: "Finance" },
  { libelle: "Rapports", href: "/rapports", groupe: "Pilotage" },
];

export function EnteteApplication() {
  const cheminActuel = usePathname();
  const titre = titresPages[cheminActuel] ?? "Espace COFIS";
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="flex h-[76px] items-center justify-between px-4 sm:px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOuvert}
            aria-controls="navigation-mobile"
            onClick={() => setMenuOuvert((ouvert) => !ouvert)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 md:hidden"
          >
            {menuOuvert ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="min-w-0">
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">Espace de travail / COFIS</p>
            <h1 className="truncate text-[15px] font-bold text-slate-900">{titre}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 md:gap-4">
          <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800 sm:inline-flex">Prototype · données fictives</span>
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
      </div>

      {menuOuvert && (
        <nav id="navigation-mobile" aria-label="Navigation mobile" className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg shadow-slate-200/30 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {liensMobiles.map((lien) => {
              const estActif = cheminActuel === lien.href;
              return (
                <Link
                  key={lien.href}
                  href={lien.href}
                  onClick={() => setMenuOuvert(false)}
                  aria-current={estActif ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 text-[13px] font-medium transition ${estActif ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">{lien.groupe}</span>
                  <span className="mt-1 block">{lien.libelle}</span>
                </Link>
              );
            })}
          </div>
          <p className="mt-3 border-t border-slate-100 pt-3 text-[10px] text-slate-400">Les autres modules seront disponibles dans une prochaine version.</p>
        </nav>
      )}
    </header>
  );
}
