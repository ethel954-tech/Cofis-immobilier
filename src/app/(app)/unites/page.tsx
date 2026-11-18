"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Building2, CirclePlus, DoorOpen, Home, Pencil, Search, Trash2, X, Wallet } from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";

type StatutUnite = "Disponible" | "Occupée" | "En maintenance" | "Inactive";
type TypeUnite = "Appartement" | "Studio" | "Bureau" | "Boutique" | "Entrepôt" | "Autre";
type Immeuble = { id: number; nom: string; ville: string; adresse: string; statut: "Actif" | "Inactif" };
type Unite = {
  id: number;
  reference: string;
  immeubleId: number;
  type: TypeUnite;
  etage: string;
  surface: number | null;
  loyerMensuel: number;
  statut: StatutUnite;
};

const CLE_UNITES = "cofis_demo_unites_v1";
const CLE_IMMEUBLES = "cofis_demo_immeubles_v1";
const immeublesExemple: Immeuble[] = [
  { id: 101, nom: "Résidence Les Manguiers", ville: "Yaoundé", adresse: "Quartier Bastos", statut: "Actif" },
  { id: 102, nom: "Immeuble Bonapriso", ville: "Douala", adresse: "Rue Koloko, Bonapriso", statut: "Actif" },
  { id: 103, nom: "Centre commercial Étoile", ville: "Yaoundé", adresse: "Avenue Kennedy", statut: "Actif" },
];
const unitesExemple: Unite[] = [
  { id: 201, reference: "LM-A01", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 85, loyerMensuel: 175000, statut: "Occupée" },
  { id: 202, reference: "LM-A02", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 72, loyerMensuel: 150000, statut: "Disponible" },
  { id: 203, reference: "LM-S01", immeubleId: 101, type: "Studio", etage: "Rez-de-chaussée", surface: 38, loyerMensuel: 85000, statut: "En maintenance" },
  { id: 204, reference: "IB-B03", immeubleId: 102, type: "Bureau", etage: "3e étage", surface: 110, loyerMensuel: 300000, statut: "Occupée" },
  { id: 205, reference: "CE-B01", immeubleId: 103, type: "Boutique", etage: "Rez-de-chaussée", surface: 45, loyerMensuel: 225000, statut: "Disponible" },
];
const formulaireVide = { reference: "", immeubleId: "", type: "Appartement" as TypeUnite, etage: "", surface: "", loyerMensuel: "", statut: "Disponible" as StatutUnite };
const montant = (valeur: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(valeur) + " FCFA";

export default function PageUnites() {
  const [unites, setUnites] = useState<Unite[]>(unitesExemple);
  const [immeubles, setImmeubles] = useState<Immeuble[]>(immeublesExemple);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<"Tous" | StatutUnite>("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<number | null>(null);
  const [formulaire, setFormulaire] = useState(formulaireVide);

  useEffect(() => {
    try {
      const stockUnites = localStorage.getItem(CLE_UNITES);
      const stockImmeubles = localStorage.getItem(CLE_IMMEUBLES);
      if (stockUnites) {
        const parsed: unknown = JSON.parse(stockUnites);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydratation des données de démonstration depuis localStorage.
        if (Array.isArray(parsed)) setUnites(parsed as Unite[]);
      }
      if (stockImmeubles) {
        const parsed: unknown = JSON.parse(stockImmeubles);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydratation des données de démonstration depuis localStorage.
        if (Array.isArray(parsed) && parsed.length) setImmeubles(parsed as Immeuble[]);
      }
    } catch {
      // Conserver les données de démonstration si le stockage est illisible.
    } finally {
      setInitialise(true);
    }
  }, []);

  useEffect(() => {
    if (!initialise) return;
    try { localStorage.setItem(CLE_UNITES, JSON.stringify(unites)); } catch { /* Stockage local indisponible. */ }
  }, [unites, initialise]);

  const immeubleNom = (id: number) => immeubles.find((bien) => bien.id === id)?.nom ?? "Immeuble introuvable";
  const unitesFiltrees = useMemo(() => unites.filter((unite) => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    const immeuble = immeubles.find((bien) => bien.id === unite.immeubleId);
    const correspondRecherche = !terme || [unite.reference, unite.type, unite.etage, immeuble?.nom ?? "", immeuble?.ville ?? ""].some((v) => v.toLocaleLowerCase("fr").includes(terme));
    return correspondRecherche && (filtreStatut === "Tous" || unite.statut === filtreStatut);
  }), [unites, immeubles, recherche, filtreStatut]);

  const ouvrirCreation = () => {
    setEditionId(null);
    setFormulaire({ ...formulaireVide, immeubleId: immeubles[0] ? String(immeubles[0].id) : "" });
    setModalOuvert(true);
  };
  const ouvrirEdition = (unite: Unite) => {
    setEditionId(unite.id);
    setFormulaire({ reference: unite.reference, immeubleId: String(unite.immeubleId), type: unite.type, etage: unite.etage, surface: unite.surface === null ? "" : String(unite.surface), loyerMensuel: String(unite.loyerMensuel), statut: unite.statut });
    setModalOuvert(true);
  };
  const enregistrer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reference = formulaire.reference.trim();
    const doublon = unites.some((u) => u.id !== editionId && u.immeubleId === Number(formulaire.immeubleId) && u.reference.toLocaleLowerCase("fr") === reference.toLocaleLowerCase("fr"));
    if (doublon) {
      window.alert("Cette référence existe déjà dans cet immeuble.");
      return;
    }
    const donnees: Unite = {
      id: editionId ?? Date.now(),
      reference,
      immeubleId: Number(formulaire.immeubleId),
      type: formulaire.type,
      etage: formulaire.etage.trim(),
      surface: formulaire.surface.trim() ? Number(formulaire.surface) : null,
      loyerMensuel: Number(formulaire.loyerMensuel),
      statut: formulaire.statut,
    };
    setUnites((liste) => editionId === null ? [donnees, ...liste] : liste.map((u) => u.id === editionId ? donnees : u));
    setModalOuvert(false);
    setFormulaire(formulaireVide);
  };
  const supprimer = (unite: Unite) => {
    if (window.confirm(`Supprimer l'unité ${unite.reference} de cette démonstration ?`)) {
      setUnites((liste) => liste.filter((u) => u.id !== unite.id));
    }
  };
  const totalLoyers = unites.reduce((somme, unite) => somme + unite.loyerMensuel, 0);
  const compteStatut = (statut: StatutUnite) => unites.filter((u) => u.statut === statut).length;
  const couleurStatut: Record<StatutUnite, string> = {
    Disponible: "bg-emerald-50 text-emerald-700",
    Occupée: "bg-blue-50 text-blue-700",
    "En maintenance": "bg-amber-50 text-amber-700",
    Inactive: "bg-slate-100 text-slate-500",
  };

  return (
    <CadreApplication>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Patrimoine</span><span>/</span><span className="font-medium text-slate-600">Unités / Logements</span></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Unités / Logements</h2>
            <p className="mt-1 text-sm text-slate-500">Répertoriez chaque espace locatif et rattachez-le à son immeuble.</p>
          </div>
          <button onClick={ouvrirCreation} disabled={immeubles.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><CirclePlus size={17} /> Ajouter une unité</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Total unités</span><Home size={19} className="text-blue-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{unites.length}</p><p className="mt-1 text-xs text-slate-400">Fiches de démonstration</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Disponibles</span><DoorOpen size={19} className="text-emerald-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{compteStatut("Disponible")}</p><p className="mt-1 text-xs text-slate-400">Statut déclaré</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Occupées</span><Building2 size={19} className="text-indigo-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{compteStatut("Occupée")}</p><p className="mt-1 text-xs text-slate-400">Statut déclaré</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Loyers mensuels indicatifs</span><Wallet size={19} className="text-sky-600"/></div><p className="mt-4 text-xl font-bold text-slate-900">{montant(totalLoyers)}</p><p className="mt-1 text-xs text-slate-400">Somme des loyers saisis, non contractuelle</p></article>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h3 className="text-sm font-bold text-slate-900">Répertoire des unités</h3><p className="mt-1 text-xs text-slate-400">{unitesFiltrees.length} résultat(s)</p></div><Building2 size={19} className="text-slate-400"/></div>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher une référence, un immeuble, une ville..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{(["Tous", "Disponible", "Occupée", "En maintenance", "Inactive"] as const).map((statut) => <button key={statut} onClick={() => setFiltreStatut(statut)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${filtreStatut === statut ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{statut}</button>)}</div>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-slate-50/80"><tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Unité</th><th className="px-4 py-3">Immeuble</th><th className="px-4 py-3">Type / Étage</th><th className="px-4 py-3">Surface</th><th className="px-4 py-3">Loyer mensuel</th><th className="px-4 py-3">Statut</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
            {unitesFiltrees.map((unite) => <tr key={unite.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Home size={18}/></span><div><p className="text-xs font-semibold text-slate-800">{unite.reference}</p><p className="mt-1 text-[10px] text-slate-400">Réf. UNIT-{String(unite.id).slice(-4)}</p></div></div></td><td className="px-4 py-4"><p className="text-xs font-semibold text-slate-700">{immeubleNom(unite.immeubleId)}</p><p className="mt-1 text-[10px] text-slate-400">{immeubles.find((b) => b.id === unite.immeubleId)?.ville ?? "Ville non renseignée"}</p></td><td className="px-4 py-4"><p className="text-xs text-slate-700">{unite.type}</p><p className="mt-1 text-[10px] text-slate-400">{unite.etage || "Étage non renseigné"}</p></td><td className="px-4 py-4 text-xs text-slate-600">{unite.surface === null ? "—" : `${unite.surface} m²`}</td><td className="px-4 py-4 text-xs font-semibold text-slate-700">{montant(unite.loyerMensuel)}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${couleurStatut[unite.statut]}`}>{unite.statut}</span></td><td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button onClick={() => ouvrirEdition(unite)} aria-label={`Modifier ${unite.reference}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"><Pencil size={15}/></button><button onClick={() => supprimer(unite)} aria-label={`Supprimer ${unite.reference}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15}/></button></div></td></tr>)}
            {unitesFiltrees.length === 0 && <tr><td colSpan={7} className="px-5 py-14 text-center"><Home className="mx-auto text-slate-300" size={24}/><p className="mt-3 text-sm font-semibold text-slate-700">Aucune unité trouvée</p><p className="mt-1 text-xs text-slate-400">Modifiez votre recherche ou ajoutez une unité.</p></td></tr>}
          </tbody></table></div>
          <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">Les données sont fictives et stockées localement dans ce navigateur.</div>
        </section>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-xs font-semibold text-amber-900">Mode démonstration</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Les unités et leurs loyers indicatifs sont conservés uniquement dans le stockage local de ce navigateur. Ils ne sont pas synchronisés avec une base de données. N'y saisissez pas de données personnelles ou contractuelles réelles.</p></div>
      </div>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOuvert(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="titre-unite" className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-unite" className="text-base font-bold text-slate-900">{editionId === null ? "Ajouter une unité" : "Modifier l'unité"}</h3><p className="mt-1 text-xs text-slate-500">Rattachez l'espace à un immeuble existant.</p></div><button onClick={() => setModalOuvert(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17}/></button></div>
          <form onSubmit={enregistrer} className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="reference-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Référence de l'unité *</label><input id="reference-unite" required value={formulaire.reference} onChange={(e) => setFormulaire({...formulaire, reference:e.target.value})} placeholder="Ex. : A-101" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"/></div><div><label htmlFor="immeuble-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Immeuble *</label><select id="immeuble-unite" required value={formulaire.immeubleId} onChange={(e) => setFormulaire({...formulaire, immeubleId:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Sélectionner</option>{immeubles.map((b) => <option key={b.id} value={b.id}>{b.nom} — {b.ville}</option>)}</select></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="type-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Type d'unité</label><select id="type-unite" value={formulaire.type} onChange={(e) => setFormulaire({...formulaire, type:e.target.value as TypeUnite})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{(["Appartement", "Studio", "Bureau", "Boutique", "Entrepôt", "Autre"] as const).map((type) => <option key={type}>{type}</option>)}</select></div><div><label htmlFor="etage-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Étage / Niveau</label><input id="etage-unite" value={formulaire.etage} onChange={(e) => setFormulaire({...formulaire, etage:e.target.value})} placeholder="Ex. : 2e étage" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="surface-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Surface (m²)</label><input id="surface-unite" type="number" min="0" step="0.01" value={formulaire.surface} onChange={(e) => setFormulaire({...formulaire, surface:e.target.value})} placeholder="Ex. : 75" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div><div><label htmlFor="loyer-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Loyer mensuel indicatif (FCFA) *</label><input id="loyer-unite" type="number" min="0" step="1" required value={formulaire.loyerMensuel} onChange={(e) => setFormulaire({...formulaire, loyerMensuel:e.target.value})} placeholder="150000" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div></div>
            <div><label htmlFor="statut-unite" className="mb-1.5 block text-xs font-semibold text-slate-700">Statut déclaré</label><select id="statut-unite" value={formulaire.statut} onChange={(e) => setFormulaire({...formulaire, statut:e.target.value as StatutUnite})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{(["Disponible", "Occupée", "En maintenance", "Inactive"] as const).map((statut) => <option key={statut}>{statut}</option>)}</select></div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">{editionId === null ? "Ajouter l'unité" : "Enregistrer les modifications"}</button></div>
          </form>
        </div>
      </div>}
    </CadreApplication>
  );
}
