/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */
import Link from "next/link";
import { ArrowLeft, Building2, LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Découvrir le prototype"
};

export default function PageConnexion() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-5 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/40 md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-10 text-white md:flex">
          <div className="absolute -right-24 top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-10 top-44 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-extrabold text-blue-700">C</span>
            <span><span className="block text-sm font-extrabold tracking-[0.2em]">COFIS</span><span className="text-[9px] tracking-[0.25em] text-blue-200">IMMOBILIER</span></span>
          </div>

          <div className="relative max-w-md">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-blue-100"><Building2 size={13} /> Gestion immobilière</span>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight">Tout votre patrimoine immobilier. <span className="text-blue-200">Un seul espace.</span></h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/80">Centralisez vos biens, vos locations et votre suivi financier dans un environnement de gestion unique.</p>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-blue-200"><ShieldCheck size={15} /> Un espace de travail conçu pour COFIS.</div>
        </section>

        <section className="flex min-h-[620px] flex-col justify-center px-7 py-12 sm:px-12">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 self-start text-xs font-medium text-slate-400 transition hover:text-blue-700"><ArrowLeft size={14} /> Retour</Link>
          <div className="mb-8 md:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white">C</span>
            <p className="mt-3 text-sm font-extrabold tracking-[0.2em] text-slate-900">COFIS IMMOBILIER</p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Prototype interactif</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Découvrez COFIS IMMOBILIER.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Explorez les principaux modules de gestion immobilière à travers un espace de démonstration prêt à parcourir.</p>

          <div className="mt-9 space-y-3">
            <Link href="/demo" className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700">Accéder à la démonstration</Link>
            <p className="text-center text-[11px] leading-5 text-slate-400">Aucun compte n'est nécessaire pour cette présentation.</p>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold text-amber-900">Mode prototype</p>
            <p className="mt-1 text-[11px] leading-5 text-amber-800">Les exemples sont fictifs et restent dans ce navigateur. L'authentification et la synchronisation serveur seront activées après validation et configuration dédiées.</p>
          </div>
          <p className="mt-8 text-center text-[11px] text-slate-400">COFIS IMMOBILIER · Accès réservé au personnel autorisé</p>
        </section>
      </div>
    </main>
  );
}
