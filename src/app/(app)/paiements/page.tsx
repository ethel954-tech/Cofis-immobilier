"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CirclePlus, Search, X, ReceiptText, WalletCards, Download } from "lucide-react";
import { exporterCsv } from "@/lib/export/csv";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { depotPaiementsDemo, MODES_PAIEMENT, type Paiement, type ModePaiement } from "@/lib/donnees/paiements";
import { depotBauxDemo } from "@/lib/donnees/baux";
import { depotLocatairesDemo } from "@/lib/donnees/locataires";
import { depotUnitesDemo } from "@/lib/donnees/unites";

type FormulairePaiement = Omit<Paiement, "id">;

function dateIsoPaiementValide(valeur: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;
  const date = new Date(`${valeur}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === valeur;
}
const aujourdHui = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const formulaireVide = (): FormulairePaiement => ({
  reference: "",
  bailId: 0,
  datePaiement: aujourdHui(),
  montant: 0,
  mode: "Espèces",
  referenceExterne: "",
  observation: ""
});
const formatMontant = (valeur: number) => `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(valeur)} FCFA`;

export default function PagePaiements() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [baux, setBaux] = useState<Awaited<ReturnType<typeof depotBauxDemo.lister>>>([]);
  const [locataires, setLocataires] = useState<Awaited<ReturnType<typeof depotLocatairesDemo.lister>>>([]);
  const [unites, setUnites] = useState<Awaited<ReturnType<typeof depotUnitesDemo.lister>>>([]);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState<FormulairePaiement>(formulaireVide());
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    void Promise.all([
      depotPaiementsDemo.lister(),
      depotBauxDemo.lister(),
      depotLocatairesDemo.lister(),
      depotUnitesDemo.lister()
    ]).then(([paiementsCharges, bauxCharges, locatairesCharges, unitesChargees]) => {
      setPaiements(paiementsCharges);
      setBaux(bauxCharges);
      setLocataires(locatairesCharges);
      setUnites(unitesChargees);
    }).finally(() => setInitialise(true));
  }, []);

  useEffect(() => {
    if (!initialise) return;
    void depotPaiementsDemo.enregistrer(paiements).catch(() => {
      // Le dépôt signale déjà l'indisponibilité du stockage local.
    });
  }, [paiements, initialise]);

  const paiementsFiltres = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    return paiements.filter((paiement) => {
      const bail = baux.find((element) => element.id === paiement.bailId);
      const locataire = bail ? locataires.find((element) => element.id === bail.locataireId) : undefined;
      const correspondAuTerme = !terme || [paiement.reference, paiement.mode, paiement.referenceExterne, bail?.reference ?? "", locataire?.nom ?? ""]
        .some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme));
      return correspondAuTerme && (!dateDebut || paiement.datePaiement >= dateDebut) && (!dateFin || paiement.datePaiement <= dateFin);
    }).sort((a, b) => b.datePaiement.localeCompare(a.datePaiement));
  }, [paiements, baux, locataires, recherche, dateDebut, dateFin]);

  const totalEnregistre = paiements.reduce((total, paiement) => total + paiement.montant, 0);
  const totalFiltre = paiementsFiltres.reduce((total, element) => total + element.montant, 0);

  const exporterPaiements = () => {
    exporterCsv({
      nomFichier: "cofis-paiements-demo.csv",
      entetes: ["Référence", "Date déclarée", "Référence du bail", "Locataire", "Unité", "Mode déclaré", "Montant consigné (FCFA)", "Référence externe", "Observation"],
      lignes: paiementsFiltres.map((paiement) => [
        paiement.reference, paiement.datePaiement, referenceBail(paiement.bailId),
        nomLocataire(paiement.bailId), referenceUnite(paiement.bailId), paiement.mode,
        paiement.montant, paiement.referenceExterne, paiement.observation
      ])
    });
  };

  const enregistrer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    setErreur("");
    const reference = formulaire.reference.trim();
    const referenceNormalisee = reference.toLocaleLowerCase("fr");
    if (!reference || !Number.isSafeInteger(formulaire.bailId) || formulaire.bailId <= 0 || !dateIsoPaiementValide(formulaire.datePaiement)) {
      setErreur("Renseignez une référence, un bail valide et une date de paiement valide.");
      return;
    }
    if (!Number.isSafeInteger(formulaire.montant) || formulaire.montant <= 0) {
      setErreur("Le montant doit être un nombre entier positif en FCFA, sans décimales.");
      return;
    }
    if (!MODES_PAIEMENT.includes(formulaire.mode)) {
      setErreur("Sélectionnez un mode de paiement valide.");
      return;
    }
    if (paiements.some((paiement) => paiement.reference.trim().toLocaleLowerCase("fr") === referenceNormalisee)) {
      setErreur("Cette référence de paiement existe déjà dans le registre. Utilisez une référence unique.");
      return;
    }
    if (!baux.some((bail) => bail.id === formulaire.bailId)) {
      setErreur("Le bail sélectionné n'existe plus dans les données locales.");
      return;
    }
    setPaiements((liste) => [{
      ...formulaire,
      id: Date.now(),
      reference,
      referenceExterne: formulaire.referenceExterne.trim(),
      observation: formulaire.observation.trim()
    }, ...liste]);
    setModalOuvert(false);
    setFormulaire(formulaireVide());
  };

  const nomLocataire = (bailId: number) => {
    const bail = baux.find((element) => element.id === bailId);
    return bail ? locataires.find((element) => element.id === bail.locataireId)?.nom ?? "Locataire non trouvé" : "Bail non trouvé";
  };
  const referenceBail = (bailId: number) => baux.find((element) => element.id === bailId)?.reference ?? "—";
  const referenceUnite = (bailId: number) => {
    const bail = baux.find((element) => element.id === bailId);
    return bail ? unites.find((element) => element.id === bail.uniteId)?.reference ?? "—" : "—";
  };

  return <CadreApplication>
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Finance</span><span>/</span><span className="font-medium text-slate-600">Paiements</span></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Registre des paiements</h2>
          <p className="mt-1 text-sm text-slate-500">Consignez les paiements reçus et conservez leurs références.</p>
        </div>
        <button type="button" onClick={() => { setErreur(""); setFormulaire(formulaireVide()); setModalOuvert(true); }} disabled={baux.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><CirclePlus size={17} /> Enregistrer un paiement</button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <p className="text-xs font-semibold text-amber-900">Registre de démonstration — données locales uniquement</p>
        <p className="mt-1 text-[11px] leading-5 text-amber-800">Un paiement enregistré n'est pas automatiquement affecté à une échéance. Aucun solde, impayé, remboursement, reversement ou rapprochement bancaire n'est calculé. N'utilisez pas de données financières réelles ici.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Écritures de paiement enregistrées</span><ReceiptText size={19} className="text-blue-600" /></div><p className="mt-4 text-3xl font-bold text-slate-900">{initialise ? paiements.length : "—"}</p><p className="mt-1 text-xs text-slate-400">Nombre d'entrées dans ce registre local</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Montant total consigné</span><WalletCards size={19} className="text-indigo-600" /></div><p className="mt-4 text-2xl font-bold text-slate-900">{initialise ? formatMontant(totalEnregistre) : "—"}</p><p className="mt-1 text-xs text-slate-400">Somme des montants saisis, sans allocation ni rapprochement</p></article>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-bold text-slate-900">Historique des paiements</h3><p className="mt-1 text-xs text-slate-400">{paiementsFiltres.length} écriture(s) · {formatMontant(totalFiltre)} dans la sélection</p></div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"><button type="button" onClick={exporterPaiements} disabled={!initialise || paiementsFiltres.length === 0} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40" title="Exporter les paiements actuellement filtrés au format CSV"><Download size={14} /> Exporter CSV</button><div className="relative w-full sm:w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Référence, bail, locataire, mode..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white" /></div><div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-1.5 text-[10px] text-slate-500">Du <input type="date" aria-label="Date de début" value={dateDebut} max={dateFin || undefined} onChange={(e) => setDateDebut(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600" /></label><label className="flex items-center gap-1.5 text-[10px] text-slate-500">Au <input type="date" aria-label="Date de fin" value={dateFin} min={dateDebut || undefined} onChange={(e) => setDateFin(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600" /></label>{(dateDebut || dateFin) && <button type="button" onClick={() => { setDateDebut(""); setDateFin(""); }} className="h-9 rounded-lg px-2 text-[10px] font-semibold text-blue-700 hover:bg-blue-50">Effacer les dates</button>}</div></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Référence / date</th><th className="px-4 py-3">Locataire / bail</th><th className="px-4 py-3">Unité</th><th className="px-4 py-3">Mode</th><th className="px-5 py-3 text-right">Montant consigné</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {paiementsFiltres.map((paiement) => <tr key={paiement.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-xs font-semibold text-slate-800">{paiement.reference}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(paiement.datePaiement + "T00:00:00").toLocaleDateString("fr-FR")}</p></td><td className="px-4 py-4"><p className="text-xs font-medium text-slate-700">{nomLocataire(paiement.bailId)}</p><p className="mt-1 text-[10px] text-slate-400">{referenceBail(paiement.bailId)}</p></td><td className="px-4 py-4 text-xs text-slate-600">{referenceUnite(paiement.bailId)}</td><td className="px-4 py-4"><p className="text-xs text-slate-700">{paiement.mode}</p>{paiement.referenceExterne && <p className="mt-1 text-[10px] text-slate-400">{paiement.referenceExterne}</p>}</td><td className="px-5 py-4 text-right text-xs font-bold tabular-nums text-slate-800">{formatMontant(paiement.montant)}</td></tr>)}
              {paiementsFiltres.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-slate-400">Aucun paiement ne correspond à votre recherche.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(evenement) => { if (evenement.target === evenement.currentTarget) setModalOuvert(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="titre-paiement" className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-paiement" className="text-base font-bold text-slate-900">Enregistrer un paiement</h3><p className="mt-1 text-xs text-slate-500">Ajoutez une écriture au registre de démonstration.</p></div><button type="button" onClick={() => setModalOuvert(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17} /></button></div>
          <form onSubmit={enregistrer} className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="reference-paiement" className="mb-1.5 block text-xs font-semibold text-slate-700">Référence interne *</label><input id="reference-paiement" required value={formulaire.reference} onChange={(e) => setFormulaire({ ...formulaire, reference: e.target.value })} placeholder="PAY-2026-001" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
              <div><label htmlFor="date-paiement" className="mb-1.5 block text-xs font-semibold text-slate-700">Date de réception déclarée *</label><input id="date-paiement" type="date" required value={formulaire.datePaiement} onChange={(e) => setFormulaire({ ...formulaire, datePaiement: e.target.value })} aria-describedby="aide-date-paiement" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /><span id="aide-date-paiement" className="mt-1 block text-[10px] text-slate-400">La date doit correspondre à un jour du calendrier valide.</span></div>
            </div>
            <div><label htmlFor="bail-paiement" className="mb-1.5 block text-xs font-semibold text-slate-700">Bail associé *</label><select id="bail-paiement" required value={formulaire.bailId || ""} onChange={(e) => setFormulaire({ ...formulaire, bailId: Number(e.target.value) })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Sélectionner un bail</option>{baux.map((bail) => <option key={bail.id} value={bail.id}>{bail.reference} — {locataires.find((locataire) => locataire.id === bail.locataireId)?.nom ?? "Locataire"}</option>)}</select></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="montant-paiement" className="mb-1.5 block text-xs font-semibold text-slate-700">Montant consigné (FCFA) *</label><input id="montant-paiement" type="number" min="1" step="1" required value={formulaire.montant || ""} onChange={(e) => setFormulaire({ ...formulaire, montant: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="150000" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
              <div><label htmlFor="mode-paiement" className="mb-1.5 block text-xs font-semibold text-slate-700">Mode déclaré *</label><select id="mode-paiement" required value={formulaire.mode} onChange={(e) => setFormulaire({ ...formulaire, mode: e.target.value as ModePaiement })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{MODES_PAIEMENT.map((mode) => <option key={mode}>{mode}</option>)}</select></div>
            </div>
            <div><label htmlFor="reference-externe" className="mb-1.5 block text-xs font-semibold text-slate-700">Référence externe (facultatif)</label><input id="reference-externe" value={formulaire.referenceExterne} onChange={(e) => setFormulaire({ ...formulaire, referenceExterne: e.target.value })} placeholder="Référence du reçu ou de la transaction" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></div>
            <div><label htmlFor="observation-paiement" className="mb-1.5 block text-xs font-semibold text-slate-700">Observation (facultatif)</label><textarea id="observation-paiement" rows={3} value={formulaire.observation} onChange={(e) => setFormulaire({ ...formulaire, observation: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Information complémentaire..." /></div>
            {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{erreur}</p>}
            <p className="rounded-xl bg-slate-50 p-3 text-[10px] leading-5 text-slate-500">Cette entrée sera ajoutée au registre sans modification ni suppression dans cette démonstration. Aucune échéance n'est affectée automatiquement.</p>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">Consigner le paiement</button></div>
          </form>
        </section>
      </div>}
    </div>
  </CadreApplication>;
}
