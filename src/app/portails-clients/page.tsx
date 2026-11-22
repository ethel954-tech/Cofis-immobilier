"use client";

import Link from "next/link";
import { ArrowRight, Building2, House, ShieldCheck, Users } from "lucide-react";

const espaces = [
  {
    href: "/espace-proprietaire",
    titre: "Espace propriétaire",
    description: "Consulter son patrimoine, les logements rattachés, les baux et les paiements enregistrés.",
    detail: "Vue dédiée aux propriétaires",
    Icone: Building2
  },
  {
    href: "/espace-locataire",
    titre: "Espace locataire",
    description: "Retrouver les informations du bail, du logement et l'historique des paiements saisis.",
    detail: "Vue dédiée aux locataires",
    Icone: House
  }
];

export default function PagePortailsClients() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fb] px-5 py-10 sm:py-16">
      <div className="pointer-events-none fixed -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-5xl">
        <Link href="/connexion" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-blue-700">← Retour à l'accueil COFIS</Link>
        <div className="mt-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-blue-700"><Users size={14} /> Portails clients</span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Un espace clair pour chaque client.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">Découvrez les interfaces prévues pour les propriétaires et les locataires, conçues pour leur donner accès aux informations qui les concernent.</p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {espaces.map(({ href, titre, description, detail, Icone }) => (
            <Link key={href} href={href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icone size={25} strokeWidth={1.7} /></span>
              <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">{detail}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{titre}</h2>
              <p className="mt-3 min-h-14 text-sm leading-6 text-slate-500">{description}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Découvrir l'espace <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <div><p className="text-xs font-bold text-amber-900">Aperçus de démonstration uniquement</p><p className="mt-1 text-xs leading-5 text-amber-800">Les profils et données affichés sont fictifs et stockés dans ce navigateur. Ces pages ne constituent pas encore des espaces privés : l'authentification, les autorisations et la synchronisation serveur restent à intégrer.</p></div>
        </div>
      </div>
    </main>
  );
}
