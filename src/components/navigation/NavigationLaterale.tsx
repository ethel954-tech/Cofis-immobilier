"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Building2,
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Wrench,
  Settings2,
  Users,
  Wallet
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ElementNavigation = {
  libelle: string;
  icone: LucideIcon;
  href?: string;
  actif?: boolean;
  groupe: string;
};

const elements: ElementNavigation[] = [
  { libelle: "Vue d'ensemble", icone: LayoutDashboard, href: "/dashboard", groupe: "Général" },
  { libelle: "Propriétaires", icone: Users, href: "/proprietaires", groupe: "Patrimoine" },
  { libelle: "Immeubles", icone: Building2, href: "/immeubles", groupe: "Patrimoine" },
  { libelle: "Unités / Logements", icone: Building2, href: "/unites", groupe: "Patrimoine" },
  { libelle: "Locataires", icone: Users, href: "/locataires", groupe: "Location" },
  { libelle: "Baux", icone: FileText, href: "/baux", groupe: "Location" },
  { libelle: "Maintenance", icone: Wrench, href: "/maintenance", groupe: "Patrimoine" },
  { libelle: "Échéances", icone: ClipboardList, groupe: "Finance" },
  { libelle: "Paiements", icone: CreditCard, href: "/paiements", groupe: "Finance" },
  { libelle: "Impayés", icone: BarChart3, groupe: "Finance" },
  { libelle: "Dépenses", icone: Wallet, href: "/depenses", groupe: "Finance" },
  { libelle: "Reversements", icone: ArrowLeftRight, groupe: "Finance" },
  { libelle: "Rapports", icone: BarChart3, href: "/rapports", groupe: "Pilotage" },
  { libelle: "Paramètres", icone: Settings2, href: "/parametres", groupe: "Administration" }
];

const groupes = [...new Set(elements.map((element) => element.groupe))];

export function NavigationLaterale() {
  const cheminActuel = usePathname();

  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col border-r border-slate-200/80 bg-white">
      <Link href="/dashboard" className="flex h-[82px] items-center gap-3 border-b border-slate-100 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">C</span>
        <span>
          <span className="block text-[15px] font-extrabold tracking-[0.12em] text-slate-900">COFIS</span>
          <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.22em] text-slate-400">IMMOBILIER</span>
        </span>
      </Link>

      <nav aria-label="Navigation principale" className="flex-1 overflow-y-auto px-4 py-6">
        {groupes.map((groupe) => (
          <div key={groupe} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{groupe}</p>
            <div className="space-y-1">
              {elements.filter((element) => element.groupe === groupe).map((element) => {
                const Icone = element.icone;
                const estActif = element.href === cheminActuel;
                const classes = estActif ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 font-medium";
                const contenu = (
                  <>
                    <Icone size={17} strokeWidth={1.8} />
                    <span className="flex-1">{element.libelle}</span>
                    {!element.href && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">Bientôt</span>}
                  </>
                );

                return element.href ? (
                  <Link key={element.libelle} href={element.href} aria-current={estActif ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-blue-50 hover:text-blue-700 ${classes}`}>
                    {contenu}
                  </Link>
                ) : (
                  <div key={element.libelle} aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-400">
                    {contenu}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-700">Espace COFIS</p>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">Une gestion immobilière claire, structurée et traçable.</p>
      </div>
    </aside>
  );
}
