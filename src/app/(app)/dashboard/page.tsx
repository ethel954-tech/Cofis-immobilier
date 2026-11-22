"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  Home,
  Users,
  Wallet,
  ArrowUpRight,
  CircleAlert,
  ClipboardList,
  UserRound,
  Layers3,
  Wrench
} from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";

type Enregistrement = Record<string, unknown>;

type DonneesTableau = {
  proprietaires: Enregistrement[];
  immeubles: Enregistrement[];
  unites: Enregistrement[];
  locataires: Enregistrement[];
  baux: Enregistrement[];
  paiements: Enregistrement[];
  depenses: Enregistrement[];
  maintenance: Enregistrement[];
};

const clesStockage = {
  proprietaires: "cofis_demo_proprietaires_v1",
  immeubles: "cofis_demo_immeubles_v1",
  unites: "cofis_demo_unites_v1",
  locataires: "cofis_demo_locataires_v1",
  baux: "cofis_demo_baux_v1",
  paiements: "cofis_demo_paiements_v1",
  depenses: "cofis_demo_depenses_v1",
  maintenance: "cofis_demo_maintenance_v1"
} as const;

const donneesVides: DonneesTableau = {
  proprietaires: [],
  immeubles: [],
  unites: [],
  locataires: [],
  baux: [],
  paiements: [],
  depenses: [],
  maintenance: []
};

function lireListe(cle: string): Enregistrement[] {
  try {
    const valeur: unknown = JSON.parse(window.localStorage.getItem(cle) ?? "null");
    return Array.isArray(valeur)
      ? valeur.filter((element): element is Enregistrement => typeof element === "object" && element !== null && !Array.isArray(element))
      : [];
  } catch {
    return [];
  }
}

function nombreAvecStatut(elements: Enregistrement[], statut: string) {
  return elements.filter((element) => element.statut === statut).length;
}

const raccourcis = [
  { href: "/proprietaires", titre: "Propriétaires", description: "Gérer les fiches propriétaires", icone: UserRound },
  { href: "/immeubles", titre: "Immeubles", description: "Consulter le patrimoine immobilier", icone: Building2 },
  { href: "/unites", titre: "Unités", description: "Gérer appartements et locaux", icone: Home },
  { href: "/locataires", titre: "Locataires", description: "Consulter les dossiers locataires", icone: Users },
  { href: "/baux", titre: "Baux", description: "Suivre les contrats déclarés", icone: FileText },
  { href: "/maintenance", titre: "Maintenance", description: "Suivre les signalements d’intervention", icone: Wrench },
  { href: "/paiements", titre: "Paiements", description: "Consulter le registre des paiements", icone: Wallet },
  { href: "/depenses", titre: "Dépenses", description: "Consulter le registre des dépenses", icone: ClipboardList },
  { href: "/rapports", titre: "Rapports", description: "Consulter les synthèses de démonstration", icone: ClipboardList }
];

export default function PageTableauDeBord() {
  const [donnees, setDonnees] = useState<DonneesTableau>(donneesVides);
  const [initialise, setInitialise] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lecture des données locales après le montage.
    setDonnees({
      proprietaires: lireListe(clesStockage.proprietaires),
      immeubles: lireListe(clesStockage.immeubles),
      unites: lireListe(clesStockage.unites),
      locataires: lireListe(clesStockage.locataires),
      baux: lireListe(clesStockage.baux),
      paiements: lireListe(clesStockage.paiements),
      depenses: lireListe(clesStockage.depenses),
      maintenance: lireListe(clesStockage.maintenance)
    });
    setInitialise(true);
  }, []);

  const indicateurs = useMemo(() => {
    const unitesOccupees = nombreAvecStatut(donnees.unites, "Occupée");
    const unitesDisponibles = nombreAvecStatut(donnees.unites, "Disponible");
    const locatairesActifs = nombreAvecStatut(donnees.locataires, "Actif");

    return [
      { titre: "Propriétaires", valeur: donnees.proprietaires.length, detail: "Fiches enregistrées", icone: Users, couleur: "bg-blue-50 text-blue-700" },
      { titre: "Immeubles", valeur: donnees.immeubles.length, detail: "Biens référencés", icone: Building2, couleur: "bg-indigo-50 text-indigo-700" },
      { titre: "Unités", valeur: donnees.unites.length, detail: `${unitesOccupees} occupée(s) · ${unitesDisponibles} disponible(s)`, icone: Home, couleur: "bg-sky-50 text-sky-700" },
      { titre: "Locataires actifs", valeur: locatairesActifs, detail: "Statut déclaré dans les fiches", icone: UserRound, couleur: "bg-violet-50 text-violet-700" }
    ];
  }, [donnees]);

  return (
    <CadreApplication>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Espace de travail COFIS</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">Vue d'ensemble de votre activité.</h2>
            <p className="mt-2 text-sm text-slate-500">Retrouvez les principaux volumes de votre gestion immobilière.</p>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">Démonstration locale</span>
        </div>

        <section aria-label="Indicateurs du patrimoine" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicateurs.map((indicateur) => {
            const Icone = indicateur.icone;
            return (
              <article key={indicateur.titre} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-slate-500">{indicateur.titre}</p>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${indicateur.couleur}`}><Icone size={18} strokeWidth={1.8} /></span>
                </div>
                <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{initialise ? indicateur.valeur : "—"}</p>
                <p className="mt-1 text-xs text-slate-400">{indicateur.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Suivi des dossiers</h3>
                <p className="mt-1 text-xs text-slate-500">État des données actuellement enregistrées dans ce navigateur</p>
              </div>
              <Layers3 size={19} className="text-slate-400" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Baux enregistrés</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{initialise ? donnees.baux.length : "—"}</p>
                <p className="mt-1 text-[11px] text-slate-400">{initialise ? `${nombreAvecStatut(donnees.baux, "Actif")} actif(s) selon le statut saisi` : "Chargement des données"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Unités référencées</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{initialise ? donnees.unites.length : "—"}</p>
                <p className="mt-1 text-[11px] text-slate-400">{initialise ? `${nombreAvecStatut(donnees.unites, "En maintenance")} en maintenance selon le statut saisi` : "Chargement des données"}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-[11px] text-slate-400">Les chiffres sont lus depuis le stockage local de ce navigateur.</p>
              <Link href="/baux" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800">Voir les baux <ArrowUpRight size={14} /></Link>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-xl bg-amber-50 p-2.5 text-amber-700"><CircleAlert size={18} /></span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Données financières non disponibles</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Les registres de paiements et de dépenses sont disponibles en démonstration. Les échéances, affectations, impayés, soldes et reversements ne sont pas calculés tant que les règles métier ne sont pas approuvées.</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800"><Wallet size={15} /> Prochaine étape métier</div>
              <p className="mt-2 text-[11px] leading-5 text-slate-600">Les paiements et dépenses peuvent être consultés dans leurs registres. Définir les échéances, affectations, règles de validation et rapprochements avant d'afficher des indicateurs financiers fiables.</p>
            </div>
          </article>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Activité des registres</h3>
            <p className="mt-1 text-xs text-slate-500">Volumes saisis en démonstration, sans interprétation comptable.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Link href="/paiements" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">Paiements enregistrés</span><Wallet size={18} className="text-blue-600" /></div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{initialise ? donnees.paiements.length : "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400">Écritures saisies dans le registre</p>
            </Link>
            <Link href="/depenses" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">Dépenses enregistrées</span><ClipboardList size={18} className="text-indigo-600" /></div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{initialise ? donnees.depenses.length : "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400">Pièces déclarées dans le registre</p>
            </Link>
            <Link href="/maintenance" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">Interventions ouvertes</span><Wrench size={18} className="text-amber-600" /></div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{initialise ? donnees.maintenance.filter((item) => item.statut !== "Terminée").length : "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400">Signalements non terminés</p>
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Accès rapides</h3>
            <p className="mt-1 text-xs text-slate-500">Accédez directement aux modules disponibles.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {raccourcis.map((raccourci) => {
              const Icone = raccourci.icone;
              return (
                <Link key={raccourci.href} href={raccourci.href} className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icone size={18} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800">{raccourci.titre}</span><span className="mt-1 block text-[11px] text-slate-400">{raccourci.description}</span></span>
                  <ArrowUpRight size={15} className="text-slate-300 transition group-hover:text-blue-600" />
                </Link>
              );
            })}
          </div>
        </section>

        <p className="text-center text-[10px] text-slate-400">COFIS IMMOBILIER · Les données de démonstration restent locales à ce navigateur.</p>
      </div>
    </CadreApplication>
  );
}
