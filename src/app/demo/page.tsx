"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initialiserDonneesDemo } from "@/lib/demo/donnees";
import { Building2, LoaderCircle, ShieldCheck } from "lucide-react";

export default function PageDemo() {
  const routeur = useRouter();

  useEffect(() => {
    initialiserDonneesDemo();
    routeur.replace("/dashboard");
  }, [routeur]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Building2 size={26} /></span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">COFIS IMMOBILIER</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Préparation de la démonstration</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Chargement des exemples fictifs et ouverture de votre espace de présentation.</p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-blue-700"><LoaderCircle size={16} className="animate-spin" /> Initialisation en cours…</div>
        <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-left text-[11px] leading-5 text-amber-800"><ShieldCheck size={15} className="mt-0.5 shrink-0" /> Mode prototype uniquement : aucune authentification ni connexion à une base partagée. Les données sont fictives et restent dans ce navigateur.</div>
      </section>
    </main>
  );
}
