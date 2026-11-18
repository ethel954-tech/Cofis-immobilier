/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */
import { Building2, CreditCard, FileText, Users, Wallet, ArrowUpRight, Clock3, CircleAlert } from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";

const indicateurs = [
  { titre: "Biens immobiliers", valeur: "—", detail: "Immeubles enregistrés", icone: Building2 },
  { titre: "Locataires actifs", valeur: "—", detail: "Contrats en cours", icone: Users },
  { titre: "Loyers encaissés", valeur: "—", detail: "Ce mois · FCFA", icone: CreditCard },
  { titre: "Dépenses", valeur: "—", detail: "Ce mois · FCFA", icone: Wallet }
];

export default function PageTableauDeBord() {
  return (
    <CadreApplication>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">Bonjour, bienvenue dans COFIS</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">Pilotez votre activité immobilière.</h2>
          <p className="mt-2 text-sm text-slate-500">Retrouvez les indicateurs essentiels de votre gestion locative.</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">Aperçu · Données non connectées</span>
      </div>

      <section aria-label="Indicateurs clés" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {indicateurs.map((indicateur) => {
          const Icone = indicateur.icone;
          return (
            <article key={indicateur.titre} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-slate-500">{indicateur.titre}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icone size={18} strokeWidth={1.8} /></span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{indicateur.valeur}</p>
              <p className="mt-1 text-xs text-slate-400">{indicateur.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-5 2xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="text-sm font-bold text-slate-900">Suivi des encaissements</h3><p className="mt-1 text-xs text-slate-500">Évolution mensuelle des loyers perçus</p></div>
            <span className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-500">Année en cours</span>
          </div>
          <div className="mt-8 flex h-52 items-end justify-between gap-2 border-b border-slate-100 px-1 sm:gap-4">
            {[34, 48, 40, 62, 53, 72, 60, 82, 66, 76, 58, 90].map((hauteur, index) => (
              <div key={index} className="flex h-full flex-1 flex-col justify-end">
                <div className="rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 opacity-80" style={{ height: hauteur + "%" }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-400"><span>Jan</span><span>Mar</span><span>Mai</span><span>Juil</span><span>Sep</span><span>Nov</span></div>
          <p className="mt-5 text-[11px] text-slate-400">Graphique illustratif uniquement. Il sera alimenté par les données réelles après validation du modèle financier.</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
          <div><h3 className="text-sm font-bold text-slate-900">Points d'attention</h3><p className="mt-1 text-xs text-slate-500">Éléments à suivre dans votre activité</p></div>
          <div className="mt-6 space-y-4">
            <div className="flex gap-3 rounded-xl bg-amber-50/70 p-3.5"><span className="mt-0.5 text-amber-700"><CircleAlert size={17} /></span><div><p className="text-xs font-semibold text-slate-800">Loyers en retard</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Le suivi des impayés sera disponible dans le module Finance.</p></div></div>
            <div className="flex gap-3 rounded-xl bg-blue-50/70 p-3.5"><span className="mt-0.5 text-blue-700"><Clock3 size={17} /></span><div><p className="text-xs font-semibold text-slate-800">Prochaines échéances</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Les échéances seront calculées à partir des baux actifs.</p></div></div>
            <div className="flex gap-3 rounded-xl bg-slate-50 p-3.5"><span className="mt-0.5 text-slate-600"><FileText size={17} /></span><div><p className="text-xs font-semibold text-slate-800">Documents à traiter</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Le suivi documentaire sera intégré dans une prochaine étape.</p></div></div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold text-blue-700">Modules métier en préparation <ArrowUpRight size={14} /></div>
        </article>
      </section>
      <p className="mt-8 text-center text-[10px] text-slate-400">COFIS IMMOBILIER · Plateforme de gestion locative</p>
    </CadreApplication>
  );
}
