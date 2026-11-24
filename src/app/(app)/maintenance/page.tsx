"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { AlertCircle, CalendarDays, CheckCircle2, CirclePlus, Clock3, Download, Search, Wrench, X } from "lucide-react";
import { exporterCsv } from "@/lib/export/csv";

type StatutIntervention = "Nouvelle" | "Planifiée" | "En cours" | "Terminée";
type Priorite = "Basse" | "Normale" | "Urgente";
type Intervention = {
  id: number;
  reference: string;
  immeuble: string;
  logement: string;
  categorie: string;
  priorite: Priorite;
  dateSignalement: string;
  description: string;
  statut: StatutIntervention;
};
type Formulaire = Omit<Intervention, "id" | "reference" | "statut">;

const CLE = "cofis_demo_maintenance_v1";
const categoriesAutorisees = ["Plomberie", "Électricité", "Menuiserie", "Nettoyage", "Sécurité", "Entretien", "Autre"] as const;
const prioritesAutorisees: readonly Priorite[] = ["Basse", "Normale", "Urgente"];
const statutsAutorises: readonly StatutIntervention[] = ["Nouvelle", "Planifiée", "En cours", "Terminée"];
function dateValide(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [annee, mois, jour] = date.split("-").map(Number);
  const valeur = new Date(annee, mois - 1, jour);
  return valeur.getFullYear() === annee && valeur.getMonth() === mois - 1 && valeur.getDate() === jour;
}
const exemples: Intervention[] = [
  { id: 1, reference: "INT-DEMO-001", immeuble: "Résidence Les Manguiers", logement: "LM-A01", categorie: "Plomberie", priorite: "Urgente", dateSignalement: "2026-11-18", description: "Fuite signalée sous l'évier de la cuisine (exemple fictif).", statut: "En cours" },
  { id: 2, reference: "INT-DEMO-002", immeuble: "Immeuble Bonapriso", logement: "IB-B03", categorie: "Électricité", priorite: "Normale", dateSignalement: "2026-11-20", description: "Vérification d'un interrupteur dans le séjour.", statut: "Planifiée" },
  { id: 3, reference: "INT-DEMO-003", immeuble: "Résidence Les Manguiers", logement: "Parties communes", categorie: "Entretien", priorite: "Basse", dateSignalement: "2026-11-21", description: "Remplacement d'une ampoule dans l'escalier.", statut: "Terminée" }
];
const dateLocale = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const formulaireVide = (): Formulaire => ({ immeuble: "", logement: "", categorie: "Plomberie", priorite: "Normale", dateSignalement: dateLocale(), description: "" });
const couleursStatut: Record<StatutIntervention, string> = {
  Nouvelle: "bg-blue-50 text-blue-700",
  Planifiée: "bg-violet-50 text-violet-700",
  "En cours": "bg-amber-50 text-amber-800",
  Terminée: "bg-emerald-50 text-emerald-700"
};
const couleursPriorite: Record<Priorite, string> = {
  Basse: "text-slate-500",
  Normale: "text-blue-700",
  Urgente: "text-rose-700"
};

export default function PageMaintenance() {
  const [interventions, setInterventions] = useState<Intervention[]>(exemples);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState<Formulaire>(formulaireVide());
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const identifiant = window.setTimeout(() => {
      try {
        const brut = localStorage.getItem(CLE);
        if (brut) {
          const valeur: unknown = JSON.parse(brut);
          if (Array.isArray(valeur)) {
            const valides = valeur.filter((element): element is Intervention => {
              if (typeof element !== "object" || element === null || Array.isArray(element)) return false;
              const item = element as Partial<Intervention>;
              return Number.isSafeInteger(item.id)
                && typeof item.reference === "string"
                && typeof item.immeuble === "string"
                && typeof item.logement === "string"
                && typeof item.categorie === "string"
                && categoriesAutorisees.includes(item.categorie as typeof categoriesAutorisees[number])
                && prioritesAutorisees.includes(item.priorite as Priorite)
                && typeof item.dateSignalement === "string"
                && dateValide(item.dateSignalement)
                && typeof item.description === "string"
                && statutsAutorises.includes(item.statut as StatutIntervention);
            });
            setInterventions(valides);
          }
        }
      } catch { /* Conserver les exemples si le stockage est illisible. */ }
      setInitialise(true);
    }, 0);
    return () => window.clearTimeout(identifiant);
  }, []);

  useEffect(() => {
    if (!initialise) return;
    try { localStorage.setItem(CLE, JSON.stringify(interventions)); } catch { /* Stockage local indisponible. */ }
  }, [interventions, initialise]);

  const listeFiltree = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    return interventions.filter((item) => {
      const correspond = !terme || [item.reference, item.immeuble, item.logement, item.categorie, item.priorite, item.statut, item.description].some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme));
      return correspond && (filtreStatut === "Tous" || item.statut === filtreStatut);
    }).sort((a, b) => b.dateSignalement.localeCompare(a.dateSignalement));
  }, [interventions, recherche, filtreStatut]);

  const changerStatut = (id: number, statut: StatutIntervention) => {
    setInterventions((liste) => liste.map((item) => item.id === id ? { ...item, statut } : item));
  };

  const enregistrer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    setErreur("");
    if (!formulaire.immeuble.trim() || !formulaire.dateSignalement || !formulaire.description.trim()) {
      setErreur("Renseignez l'immeuble, la date et la description du signalement.");
      return;
    }
    if (!dateValide(formulaire.dateSignalement)) {
      setErreur("La date du signalement doit être une date calendaire valide.");
      return;
    }
    if (!categoriesAutorisees.includes(formulaire.categorie as typeof categoriesAutorisees[number]) || !prioritesAutorisees.includes(formulaire.priorite)) {
      setErreur("La catégorie ou la priorité sélectionnée n'est pas valide.");
      return;
    }
    const id = Date.now();
    const nouvelle: Intervention = {
      ...formulaire,
      id,
      reference: `INT-DEMO-${String(id).slice(-6)}`,
      immeuble: formulaire.immeuble.trim(),
      logement: formulaire.logement.trim() || "Non précisé",
      description: formulaire.description.trim(),
      statut: "Nouvelle"
    };
    setInterventions((liste) => [nouvelle, ...liste]);
    setModalOuvert(false);
    setFormulaire(formulaireVide());
  };

  const nombreActif = interventions.filter((item) => item.statut !== "Terminée").length;
  const nombreUrgent = interventions.filter((item) => item.priorite === "Urgente" && item.statut !== "Terminée").length;
  const nombreTermine = interventions.filter((item) => item.statut === "Terminée").length;
  const exporter = () => exporterCsv({
    nomFichier: "cofis-interventions-demo.csv",
    entetes: ["Référence", "Date du signalement", "Immeuble", "Logement / zone", "Catégorie", "Priorité", "Statut", "Description"],
    lignes: listeFiltree.map((item) => [item.reference, item.dateSignalement, item.immeuble, item.logement, item.categorie, item.priorite, item.statut, item.description])
  });

  return <CadreApplication>
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Patrimoine</span><span>/</span><span className="font-medium text-slate-600">Maintenance</span></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Suivi des interventions</h2>
          <p className="mt-1 text-sm text-slate-500">Centralisez les signalements et suivez leur état d'avancement.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exporter} disabled={!initialise || listeFiltree.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} /> Exporter CSV</button>
          <button type="button" onClick={() => { setErreur(""); setFormulaire(formulaireVide()); setModalOuvert(true); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"><CirclePlus size={17} /> Nouveau signalement</button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <p className="text-xs font-semibold text-amber-900">Module de démonstration — données fictives et stockage local</p>
        <p className="mt-1 text-[11px] leading-5 text-amber-800">Ce registre illustre le parcours de signalement. Il n'envoie aucune notification et ne planifie pas réellement de prestataire. Les responsabilités, validations, coûts et délais d'intervention restent à définir avec COFIS.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Interventions ouvertes</span><Clock3 size={19} className="text-blue-600" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{initialise ? nombreActif : "—"}</p><p className="mt-1 text-xs text-slate-400">À traiter ou en cours</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Priorité urgente</span><AlertCircle size={19} className="text-rose-600" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{initialise ? nombreUrgent : "—"}</p><p className="mt-1 text-xs text-slate-400">Signalements non terminés</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Terminées</span><CheckCircle2 size={19} className="text-emerald-600" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{initialise ? nombreTermine : "—"}</p><p className="mt-1 text-xs text-slate-400">Dans le registre local</p></article>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div><h3 className="text-sm font-bold text-slate-900">Registre des interventions</h3><p className="mt-1 text-xs text-slate-400">{listeFiltree.length} signalement(s) affiché(s)</p></div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative min-w-0 flex-1 sm:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Référence, immeuble, priorité, statut..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" /></div>
            <select aria-label="Filtrer par statut" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-blue-400"><option value="Tous">Tous les statuts</option><option>Nouvelle</option><option>Planifiée</option><option>En cours</option><option>Terminée</option></select>
          </div>
        </div>
        {listeFiltree.length === 0 ? <div className="px-6 py-14 text-center"><Wrench size={28} className="mx-auto text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">Aucun signalement trouvé</p><p className="mt-1 text-xs text-slate-400">Modifiez votre recherche ou enregistrez une nouvelle intervention.</p></div> : <>
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Référence / Date</th><th className="px-5 py-3">Immeuble / Logement</th><th className="px-5 py-3">Nature</th><th className="px-5 py-3">Priorité</th><th className="px-5 py-3">Statut</th></tr></thead><tbody className="divide-y divide-slate-100">{listeFiltree.map((item) => <tr key={item.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-xs font-semibold text-slate-800">{item.reference}</p><p className="mt-1 text-[11px] text-slate-400">{new Date(item.dateSignalement + "T12:00:00").toLocaleDateString("fr-FR")}</p></td><td className="px-5 py-4"><p className="text-xs font-medium text-slate-700">{item.immeuble}</p><p className="mt-1 text-[11px] text-slate-400">{item.logement}</p></td><td className="px-5 py-4"><p className="text-xs text-slate-700">{item.categorie}</p><p className="mt-1 max-w-xs truncate text-[11px] text-slate-400">{item.description}</p></td><td className="px-5 py-4"><span className={`text-xs font-semibold ${couleursPriorite[item.priorite]}`}>{item.priorite}</span></td><td className="px-5 py-4"><select aria-label={`Statut de ${item.reference}`} value={item.statut} onChange={(e) => changerStatut(item.id, e.target.value as StatutIntervention)} className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-semibold outline-none focus:ring-2 focus:ring-blue-200 ${couleursStatut[item.statut]}`}><option>Nouvelle</option><option>Planifiée</option><option>En cours</option><option>Terminée</option></select></td></tr>)}</tbody></table></div>
          <div className="divide-y divide-slate-100 md:hidden">{listeFiltree.map((item) => <article key={item.id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-800">{item.reference}</p><p className="mt-1 text-[11px] text-slate-400">{item.immeuble} · {item.logement}</p></div><select aria-label={`Statut de ${item.reference}`} value={item.statut} onChange={(e) => changerStatut(item.id, e.target.value as StatutIntervention)} className={`shrink-0 rounded-full border-0 px-2.5 py-1 text-[10px] font-semibold outline-none focus:ring-2 focus:ring-blue-200 ${couleursStatut[item.statut]}`}><option>Nouvelle</option><option>Planifiée</option><option>En cours</option><option>Terminée</option></select></div><p className="text-xs text-slate-600">{item.categorie} · <span className={`font-semibold ${couleursPriorite[item.priorite]}`}>{item.priorite}</span></p><p className="text-xs leading-5 text-slate-500">{item.description}</p><p className="flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays size={12} /> {new Date(item.dateSignalement + "T12:00:00").toLocaleDateString("fr-FR")}</p></article>)}</div>
        </>}
      </section>
    </div>

    {modalOuvert && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOuvert(false); }}><section role="dialog" aria-modal="true" aria-labelledby="titre-modal-maintenance" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"><div className="mb-5 flex items-start justify-between"><div><h3 id="titre-modal-maintenance" className="text-lg font-bold text-slate-900">Nouveau signalement</h3><p className="mt-1 text-xs text-slate-500">Décrivez le besoin d'intervention.</p></div><button type="button" aria-label="Fermer" onClick={() => setModalOuvert(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div>
      <form onSubmit={enregistrer} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-600">Immeuble *<input autoFocus value={formulaire.immeuble} onChange={(e) => setFormulaire({ ...formulaire, immeuble: e.target.value })} placeholder="Nom de l'immeuble" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-xs font-semibold text-slate-600">Logement / zone<input value={formulaire.logement} onChange={(e) => setFormulaire({ ...formulaire, logement: e.target.value })} placeholder="Ex. A-02, parties communes" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-xs font-semibold text-slate-600">Catégorie<select value={formulaire.categorie} onChange={(e) => setFormulaire({ ...formulaire, categorie: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal"><option>Plomberie</option><option>Électricité</option><option>Menuiserie</option><option>Nettoyage</option><option>Sécurité</option><option>Entretien</option><option>Autre</option></select></label><label className="block text-xs font-semibold text-slate-600">Priorité<select value={formulaire.priorite} onChange={(e) => setFormulaire({ ...formulaire, priorite: e.target.value as Priorite })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal"><option>Basse</option><option>Normale</option><option>Urgente</option></select></label><label className="block text-xs font-semibold text-slate-600 sm:col-span-2">Date du signalement<input type="date" value={formulaire.dateSignalement} onChange={(e) => setFormulaire({ ...formulaire, dateSignalement: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label></div><label className="block text-xs font-semibold text-slate-600">Description *<textarea rows={4} value={formulaire.description} onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })} placeholder="Décrivez le problème constaté..." className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>{erreur && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{erreur}</p>}<div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">Enregistrer le signalement</button></div></form>
    </section></div>}
  </CadreApplication>;
}
