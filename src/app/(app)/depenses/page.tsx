"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Wallet, CirclePlus, Search, X, Receipt, ClipboardList } from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";

type Depense = {
  id: number;
  reference: string;
  dateDepense: string;
  categorie: string;
  description: string;
  fournisseur: string;
  montant: number;
  referenceJustificatif: string;
};
type FormulaireDepense = Omit<Depense, "id">;

const CLE_DEPENSES = "cofis_demo_depenses_v1";
const depensesExemple: Depense[] = [
  { id: 601, reference: "DEP-DEMO-001", dateDepense: "2026-11-03", categorie: "Entretien", description: "Réparation d'une fuite — exemple fictif", fournisseur: "Plomberie Exemple", montant: 45000, referenceJustificatif: "FACT-DEMO-03" },
  { id: 602, reference: "DEP-DEMO-002", dateDepense: "2026-11-08", categorie: "Nettoyage", description: "Nettoyage des parties communes — exemple fictif", fournisseur: "Services Propreté", montant: 25000, referenceJustificatif: "" }
];
const aujourdHui = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const formulaireVide = (): FormulaireDepense => ({
  reference: "",
  dateDepense: aujourdHui(),
  categorie: "Entretien",
  description: "",
  fournisseur: "",
  montant: 0,
  referenceJustificatif: ""
});
const formatMontant = (valeur: number) => `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(valeur)} FCFA`;

export default function PageDepenses() {
  const [depenses, setDepenses] = useState<Depense[]>(depensesExemple);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState<FormulaireDepense>(formulaireVide());
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE_DEPENSES);
      if (brut) {
        const valeur: unknown = JSON.parse(brut);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydratation initiale du registre local.
        if (Array.isArray(valeur)) setDepenses(valeur as Depense[]);
      }
    } catch { /* Conserver les exemples si le stockage est illisible. */ }
    setInitialise(true);
  }, []);

  useEffect(() => {
    if (!initialise) return;
    try { localStorage.setItem(CLE_DEPENSES, JSON.stringify(depenses)); } catch { /* Stockage local indisponible. */ }
  }, [depenses, initialise]);

  const depensesFiltrees = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    return depenses.filter((depense) => !terme || [
      depense.reference, depense.categorie, depense.description, depense.fournisseur, depense.referenceJustificatif
    ].some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme)))
      .sort((a, b) => b.dateDepense.localeCompare(a.dateDepense));
  }, [depenses, recherche]);
  const totalConsigne = depenses.reduce((total, depense) => total + depense.montant, 0);

  const enregistrer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    setErreur("");
    const reference = formulaire.reference.trim();
    if (!reference || !formulaire.dateDepense || !formulaire.description.trim() || !Number.isSafeInteger(formulaire.montant) || formulaire.montant <= 0) {
      setErreur("Renseignez une référence, une date, une description et un montant entier strictement positif.");
      return;
    }
    if (depenses.some((depense) => depense.reference.toLocaleLowerCase("fr") === reference.toLocaleLowerCase("fr"))) {
      setErreur("Cette référence de dépense existe déjà dans le registre.");
      return;
    }
    setDepenses((liste) => [{ ...formulaire, id: Date.now(), reference, description: formulaire.description.trim() }, ...liste]);
    setModalOuvert(false);
    setFormulaire(formulaireVide());
  };

  return <CadreApplication>
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Finance</span><span>/</span><span className="font-medium text-slate-600">Dépenses</span></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Registre des dépenses</h2>
          <p className="mt-1 text-sm text-slate-500">Consignez les dépenses déclarées et les références de leurs justificatifs.</p>
        </div>
        <button type="button" onClick={() => { setErreur(""); setFormulaire(formulaireVide()); setModalOuvert(true); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"><CirclePlus size={17} /> Enregistrer une dépense</button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <p className="text-xs font-semibold text-amber-900">Registre de démonstration — données locales uniquement</p>
        <p className="mt-1 text-[11px] leading-5 text-amber-800">Une dépense consignée n'est pas automatiquement approuvée, payée, imputée à un immeuble ou déduite d'un reversement. Les règles de validation, de rattachement et de remboursement restent à confirmer. N'utilisez pas de données réelles ici.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Écritures de dépense enregistrées</span><ClipboardList size={19} className="text-blue-600" /></div><p className="mt-4 text-3xl font-bold text-slate-900">{initialise ? depenses.length : "—"}</p><p className="mt-1 text-xs text-slate-400">Nombre d'entrées dans ce registre local</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Montant total consigné</span><Receipt size={19} className="text-indigo-600" /></div><p className="mt-4 text-2xl font-bold text-slate-900">{initialise ? formatMontant(totalConsigne) : "—"}</p><p className="mt-1 text-xs text-slate-400">Somme des montants déclarés, sans validation comptable</p></article>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-bold text-slate-900">Historique des dépenses déclarées</h3><p className="mt-1 text-xs text-slate-400">{depensesFiltrees.length} écriture(s)</p></div>
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Référence, catégorie, fournisseur..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Référence / date</th><th className="px-4 py-3">Désignation</th><th className="px-4 py-3">Catégorie</th><th className="px-4 py-3">Fournisseur</th><th className="px-5 py-3 text-right">Montant déclaré</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {depensesFiltrees.map((depense) => <tr key={depense.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-xs font-semibold text-slate-800">{depense.reference}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(depense.dateDepense + "T00:00:00").toLocaleDateString("fr-FR")}</p></td><td className="px-4 py-4"><p className="text-xs text-slate-700">{depense.description}</p>{depense.referenceJustificatif && <p className="mt-1 text-[10px] text-slate-400">Justificatif : {depense.referenceJustificatif}</p>}</td><td className="px-4 py-4 text-xs text-slate-600">{depense.categorie}</td><td className="px-4 py-4 text-xs text-slate-600">{depense.fournisseur || "—"}</td><td className="px-5 py-4 text-right text-xs font-bold tabular-nums text-slate-800">{formatMontant(depense.montant)}</td></tr>)}
              {depensesFiltrees.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-slate-400">Aucune dépense ne correspond à votre recherche.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(evenement) => { if (evenement.target === evenement.currentTarget) setModalOuvert(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="titre-depense" className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-depense" className="text-base font-bold text-slate-900">Enregistrer une dépense</h3><p className="mt-1 text-xs text-slate-500">Ajoutez une écriture au registre de démonstration.</p></div><button type="button" onClick={() => setModalOuvert(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17} /></button></div>
          <form onSubmit={enregistrer} className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="reference-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Référence interne *</label><input id="reference-depense" required value={formulaire.reference} onChange={(e) => setFormulaire({ ...formulaire, reference: e.target.value })} placeholder="DEP-2026-001" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
              <div><label htmlFor="date-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Date déclarée *</label><input id="date-depense" type="date" required value={formulaire.dateDepense} onChange={(e) => setFormulaire({ ...formulaire, dateDepense: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="categorie-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Catégorie *</label><select id="categorie-depense" value={formulaire.categorie} onChange={(e) => setFormulaire({ ...formulaire, categorie: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Entretien</option><option>Réparation</option><option>Nettoyage</option><option>Sécurité</option><option>Services</option><option>Frais administratifs</option><option>Autre</option></select></div>
              <div><label htmlFor="montant-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Montant déclaré (FCFA) *</label><input id="montant-depense" type="number" min="1" step="1" required value={formulaire.montant || ""} onChange={(e) => setFormulaire({ ...formulaire, montant: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="45000" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
            </div>
            <div><label htmlFor="description-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Description *</label><input id="description-depense" required value={formulaire.description} onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })} placeholder="Ex. : réparation d'une fuite d'eau" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="fournisseur-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Fournisseur / prestataire</label><input id="fournisseur-depense" value={formulaire.fournisseur} onChange={(e) => setFormulaire({ ...formulaire, fournisseur: e.target.value })} placeholder="Nom du prestataire" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
              <div><label htmlFor="justificatif-depense" className="mb-1.5 block text-xs font-semibold text-slate-700">Référence du justificatif</label><input id="justificatif-depense" value={formulaire.referenceJustificatif} onChange={(e) => setFormulaire({ ...formulaire, referenceJustificatif: e.target.value })} placeholder="Facture, reçu, référence..." className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
            </div>
            {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{erreur}</p>}
            <p className="rounded-xl bg-slate-50 p-3 text-[10px] leading-5 text-slate-500">Cette entrée sera ajoutée au registre sans modification ni suppression dans cette démonstration. Aucun immeuble, propriétaire ou reversement n'est automatiquement associé.</p>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">Consigner la dépense</button></div>
          </form>
        </section>
      </div>}
    </div>
  </CadreApplication>;
}
