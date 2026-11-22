"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useState, type FormEvent } from "react";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { Building2, CheckCircle2, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";

type ParametresAgence = {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  devise: "XAF";
};

const CLE = "cofis_demo_parametres_agence_v1";
const valeursInitiales: ParametresAgence = {
  nom: "COFIS IMMOBILIER",
  telephone: "",
  email: "",
  adresse: "",
  ville: "Yaoundé",
  devise: "XAF"
};

const roles = [
  { nom: "Administrateur", description: "Administration générale et configuration de la plateforme.", acces: ["Vue d'ensemble", "Patrimoine", "Location", "Finance", "Rapports", "Administration"] },
  { nom: "Gestionnaire immobilier", description: "Suivi opérationnel des biens, unités, locataires et baux.", acces: ["Vue d'ensemble", "Patrimoine", "Location", "Maintenance"] },
  { nom: "Comptable / Finance", description: "Suivi des paiements, dépenses et opérations financières autorisées.", acces: ["Vue d'ensemble", "Paiements", "Dépenses", "Finance", "Rapports"] },
  { nom: "Direction", description: "Consultation des indicateurs et rapports de pilotage.", acces: ["Vue d'ensemble", "Rapports"] }
];

export default function PageParametres() {
  const [onglet, setOnglet] = useState<"agence" | "roles">("agence");
  const [formulaire, setFormulaire] = useState<ParametresAgence>(valeursInitiales);
  const [initialise, setInitialise] = useState(false);
  const [enregistre, setEnregistre] = useState(false);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) {
        const valeur: unknown = JSON.parse(brut);
        if (typeof valeur === "object" && valeur !== null && !Array.isArray(valeur)) {
          setFormulaire({ ...valeursInitiales, ...(valeur as Partial<ParametresAgence>) });
        }
      }
    } catch { /* Conserver les paramètres initiaux. */ }
    setInitialise(true);
  }, []);

  const enregistrer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    try {
      localStorage.setItem(CLE, JSON.stringify(formulaire));
      setEnregistre(true);
      window.setTimeout(() => setEnregistre(false), 2800);
    } catch {
      setEnregistre(false);
      window.alert("Le navigateur n'a pas pu enregistrer ces paramètres.");
    }
  };

  return (
    <CadreApplication>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span className="font-medium text-slate-600">Administration</span></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Paramètres</h2>
          <p className="mt-1 text-sm text-slate-500">Consultez les informations de l'agence et le modèle de rôles prévu pour COFIS.</p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button type="button" onClick={() => setOnglet("agence")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${onglet === "agence" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}><Building2 size={15} /> Informations de l'agence</button>
          <button type="button" onClick={() => setOnglet("roles")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${onglet === "roles" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}><ShieldCheck size={15} /> Rôles et accès prévus</button>
        </div>

        {onglet === "agence" ? (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><SlidersHorizontal size={19} /></span>
              <div><h3 className="text-sm font-bold text-slate-900">Profil de l'agence</h3><p className="mt-1 text-xs text-slate-500">Informations utilisées pour personnaliser les documents et l'interface.</p></div>
            </div>
            <form onSubmit={enregistrer} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label htmlFor="agence-nom" className="mb-1.5 block text-xs font-semibold text-slate-700">Nom de l'agence *</label><input id="agence-nom" required value={formulaire.nom} onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
                <div><label htmlFor="agence-telephone" className="mb-1.5 block text-xs font-semibold text-slate-700">Téléphone</label><input id="agence-telephone" type="tel" value={formulaire.telephone} onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })} placeholder="+237 6XX XXX XXX" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
                <div><label htmlFor="agence-email" className="mb-1.5 block text-xs font-semibold text-slate-700">Adresse e-mail</label><input id="agence-email" type="email" value={formulaire.email} onChange={(e) => setFormulaire({ ...formulaire, email: e.target.value })} placeholder="contact@cofis.cm" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
                <div><label htmlFor="agence-ville" className="mb-1.5 block text-xs font-semibold text-slate-700">Ville</label><input id="agence-ville" value={formulaire.ville} onChange={(e) => setFormulaire({ ...formulaire, ville: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
                <div><label htmlFor="agence-devise" className="mb-1.5 block text-xs font-semibold text-slate-700">Devise de référence</label><input id="agence-devise" value="Franc CFA (XAF)" disabled className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" /><p className="mt-1 text-[10px] text-slate-400">Devise de référence du projet.</p></div>
                <div className="sm:col-span-2"><label htmlFor="agence-adresse" className="mb-1.5 block text-xs font-semibold text-slate-700">Adresse / siège</label><input id="agence-adresse" value={formulaire.adresse} onChange={(e) => setFormulaire({ ...formulaire, adresse: e.target.value })} placeholder="Quartier, rue, repère..." className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <p className="text-[11px] text-slate-400">{initialise ? "Modifications conservées dans ce navigateur." : "Chargement des paramètres..."}</p>
                <button type="submit" disabled={!initialise} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Enregistrer les informations</button>
              </div>
              {enregistre && <p role="status" className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} /> Informations enregistrées dans cette démonstration.</p>}
            </form>
          </section>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-semibold text-amber-900">Matrice indicative — non appliquée aux comptes</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Ces rôles illustrent le modèle d'accès proposé. Aucun compte utilisateur ni contrôle de sécurité réel n'est créé ou modifié depuis cette page. Les permissions définitives doivent être validées par COFIS puis appliquées côté serveur et base de données.</p></div>
            <div className="grid gap-4 xl:grid-cols-2">
              {roles.map((role) => (
                <article key={role.nom} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><ShieldCheck size={18} /></span><div><h3 className="text-sm font-bold text-slate-900">{role.nom}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{role.description}</p></div></div>
                  <div className="mt-5 border-t border-slate-100 pt-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Périmètre indicatif</p><div className="flex flex-wrap gap-2">{role.acces.map((acces) => <span key={acces} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-medium text-slate-600">{acces}</span>)}</div></div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </CadreApplication>
  );
}
