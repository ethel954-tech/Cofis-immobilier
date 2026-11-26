"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Building2, CirclePlus, MapPin, Pencil, Search, X, Users, Home, Layers3, Download } from "lucide-react";
import { exporterCsv } from "@/lib/export/csv";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { depotImmeublesDemo, type Immeuble, type TypeBien } from "@/lib/donnees/immeubles";
import { depotProprietairesDemo } from "@/lib/donnees/proprietaires";
import type { Proprietaire } from "@/lib/donnees/proprietaires";

const formulaireVide = { nom: "", type: "Résidentiel" as TypeBien, adresse: "", ville: "", proprietaireId: "", nombreUnites: "1", statut: "Actif" as Immeuble["statut"] };

export default function PageImmeubles() {
  const [immeubles, setImmeubles] = useState<Immeuble[]>([]);
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([]);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState<"Tous" | TypeBien>("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<number | null>(null);
  const [formulaire, setFormulaire] = useState(formulaireVide);
  const [erreurFormulaire, setErreurFormulaire] = useState("");

  useEffect(() => {
    let actif = true;

    void Promise.all([
      depotImmeublesDemo.lister(),
      depotProprietairesDemo.lister()
    ]).then(([biens, personnes]) => {
      if (!actif) return;
      setImmeubles(biens);
      setProprietaires(personnes);
    }).finally(() => {
      if (actif) setInitialise(true);
    });

    return () => {
      actif = false;
    };
  }, []);

  useEffect(() => {
    if (!initialise) return;
    void depotImmeublesDemo.enregistrer(immeubles).catch(() => {
      // L'interface reste utilisable même si le navigateur bloque le stockage local.
    });
  }, [immeubles, initialise]);

  const immeublesFiltres = useMemo(() => immeubles.filter((bien) => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    const proprietaire = proprietaires.find((p) => p.id === bien.proprietaireId)?.nom ?? "";
    return (filtreType === "Tous" || bien.type === filtreType) &&
      (!terme || [bien.nom, bien.adresse, bien.ville, proprietaire].some((v) => v.toLocaleLowerCase("fr").includes(terme)));
  }), [immeubles, proprietaires, recherche, filtreType]);

  const ouvrirCreation = () => {
    setEditionId(null);
    setFormulaire({ ...formulaireVide, proprietaireId: proprietaires[0] ? String(proprietaires[0].id) : "" });
    setModalOuvert(true);
  };
  const ouvrirEdition = (bien: Immeuble) => {
    setEditionId(bien.id);
    setFormulaire({ nom: bien.nom, type: bien.type, adresse: bien.adresse, ville: bien.ville, proprietaireId: String(bien.proprietaireId), nombreUnites: String(bien.nombreUnites), statut: bien.statut });
    setModalOuvert(true);
  };
  const exporterImmeubles = () => {
    exporterCsv({
      nomFichier: "cofis-immeubles-demo.csv",
      entetes: ["Nom", "Type", "Adresse", "Ville", "Propriétaire", "Nombre d'unités déclaré", "Statut déclaré"],
      lignes: immeublesFiltres.map((bien) => [
        bien.nom, bien.type, bien.adresse, bien.ville, nomProprietaire(bien.proprietaireId), bien.nombreUnites, bien.statut
      ])
    });
  };

  const enregistrer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nom = formulaire.nom.trim();
    const adresse = formulaire.adresse.trim();
    const ville = formulaire.ville.trim();
    const nombreUnites = Number(formulaire.nombreUnites);
    const proprietaireId = Number(formulaire.proprietaireId);
    if (!nom || !adresse || !ville) {
      setErreurFormulaire("Veuillez renseigner le nom, l'adresse et la ville.");
      return;
    }
    if (!Number.isSafeInteger(nombreUnites) || nombreUnites < 0) {
      setErreurFormulaire("Le nombre d'unités doit être un entier positif ou nul.");
      return;
    }
    if (!Number.isSafeInteger(proprietaireId) || !proprietaires.some((p) => p.id === proprietaireId)) {
      setErreurFormulaire("Sélectionnez un propriétaire existant dans le registre.");
      return;
    }
    const donnees: Immeuble = { id: editionId ?? Date.now(), nom, type: formulaire.type, adresse, ville, proprietaireId, nombreUnites, statut: formulaire.statut };
    setImmeubles((liste) => editionId === null ? [donnees, ...liste] : liste.map((bien) => bien.id === editionId ? donnees : bien));
    setErreurFormulaire("");
    setModalOuvert(false);
    setFormulaire(formulaireVide);
  };
  const nomProprietaire = (id: number) => proprietaires.find((p) => p.id === id)?.nom ?? "Propriétaire non retrouvé";

  return (
    <CadreApplication>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Patrimoine</span><span>/</span><span className="font-medium text-slate-600">Immeubles</span></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Immeubles</h2>
            <p className="mt-1 text-sm text-slate-500">Organisez le patrimoine immobilier et rattachez chaque bien à son propriétaire.</p>
          </div>
          <button onClick={ouvrirCreation} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"><CirclePlus size={17} /> Ajouter un immeuble</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Total immeubles</span><Building2 className="text-blue-600" size={19}/></div><p className="mt-4 text-3xl font-bold text-slate-900">{immeubles.length}</p><p className="mt-1 text-xs text-slate-400">Fiches enregistrées dans cette démonstration</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Unités déclarées</span><Home className="text-indigo-600" size={19}/></div><p className="mt-4 text-3xl font-bold text-slate-900">{immeubles.reduce((s, b) => s + b.nombreUnites, 0)}</p><p className="mt-1 text-xs text-slate-400">Capacité déclarée des immeubles</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Propriétaires liés</span><Users className="text-sky-600" size={19}/></div><p className="mt-4 text-3xl font-bold text-slate-900">{new Set(immeubles.map((b) => b.proprietaireId)).size}</p><p className="mt-1 text-xs text-slate-400">Propriétaires associés à un bien</p></article>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h3 className="text-sm font-bold text-slate-900">Répertoire des immeubles</h3><p className="mt-1 text-xs text-slate-400">{immeublesFiltres.length} résultat(s)</p></div><div className="flex items-center gap-3"><button type="button" onClick={exporterImmeubles} disabled={immeublesFiltres.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40" title="Exporter les immeubles filtrés au format CSV"><Download size={14}/> Exporter CSV</button><Layers3 size={19} className="text-slate-400"/></div></div>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un immeuble, une ville, un propriétaire..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{(["Tous", "Résidentiel", "Commercial", "Mixte"] as const).map((t) => <button key={t} onClick={() => setFiltreType(t)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${filtreType === t ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{t}</button>)}</div>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/80"><tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Immeuble</th><th className="px-4 py-3">Localisation</th><th className="px-4 py-3">Propriétaire</th><th className="px-4 py-3">Unités</th><th className="px-4 py-3">Type</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">
            {immeublesFiltres.map((bien) => <tr key={bien.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Building2 size={18}/></span><div><p className="text-xs font-semibold text-slate-800">{bien.nom}</p><p className="mt-1 text-[10px] text-slate-400">{bien.statut} · Réf. IMM-{String(bien.id).slice(-4)}</p></div></div></td><td className="px-4 py-4"><p className="flex items-center gap-1.5 text-[11px] text-slate-600"><MapPin size={12}/>{bien.adresse}</p><p className="mt-1 pl-4 text-[10px] text-slate-400">{bien.ville}</p></td><td className="px-4 py-4 text-xs text-slate-600">{nomProprietaire(bien.proprietaireId)}</td><td className="px-4 py-4 text-xs font-semibold text-slate-700">{bien.nombreUnites}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">{bien.type}</span></td><td className="px-5 py-4 text-right"><button onClick={() => ouvrirEdition(bien)} aria-label={`Modifier ${bien.nom}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"><Pencil size={16}/></button></td></tr>)}
            {immeublesFiltres.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center"><Building2 className="mx-auto text-slate-300" size={24}/><p className="mt-3 text-sm font-semibold text-slate-700">Aucun immeuble trouvé</p><p className="mt-1 text-xs text-slate-400">Modifiez votre recherche ou ajoutez un immeuble.</p></td></tr>}
          </tbody></table></div>
          <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">Les données sont fictives et stockées localement dans ce navigateur.</div>
        </section>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-xs font-semibold text-amber-900">Mode démonstration</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Les immeubles et leurs rattachements sont conservés uniquement dans le stockage local de ce navigateur. Ils ne sont pas synchronisés avec une base de données ni partagés avec d'autres utilisateurs. N'y saisissez pas de données personnelles réelles.</p></div>
      </div>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOuvert(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="titre-immeuble" className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-immeuble" className="text-base font-bold text-slate-900">{editionId === null ? "Ajouter un immeuble" : "Modifier l'immeuble"}</h3><p className="mt-1 text-xs text-slate-500">Renseignez les informations principales du bien.</p></div><button onClick={() => setModalOuvert(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17}/></button></div>
          <form onSubmit={enregistrer} onChange={() => setErreurFormulaire("")} className="space-y-4 p-5">
            <div><label htmlFor="nom-immeuble" className="mb-1.5 block text-xs font-semibold text-slate-700">Nom de l'immeuble *</label><input id="nom-immeuble" required value={formulaire.nom} onChange={(e) => setFormulaire({...formulaire, nom:e.target.value})} placeholder="Ex. : Résidence Les Palmiers" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"/></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="type-immeuble" className="mb-1.5 block text-xs font-semibold text-slate-700">Type de bien</label><select id="type-immeuble" value={formulaire.type} onChange={(e) => setFormulaire({...formulaire, type:e.target.value as TypeBien})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Résidentiel</option><option>Commercial</option><option>Mixte</option></select></div><div><label htmlFor="unites-immeuble" className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre d'unités</label><input id="unites-immeuble" type="number" min="0" step="1" required value={formulaire.nombreUnites} onChange={(e) => setFormulaire({...formulaire, nombreUnites:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div></div>
            <div><label htmlFor="adresse-immeuble" className="mb-1.5 block text-xs font-semibold text-slate-700">Adresse / quartier *</label><input id="adresse-immeuble" required value={formulaire.adresse} onChange={(e) => setFormulaire({...formulaire, adresse:e.target.value})} placeholder="Ex. : Bastos, derrière l'ambassade..." className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="ville-immeuble" className="mb-1.5 block text-xs font-semibold text-slate-700">Ville *</label><input id="ville-immeuble" required value={formulaire.ville} onChange={(e) => setFormulaire({...formulaire, ville:e.target.value})} placeholder="Yaoundé" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div><div><label htmlFor="proprietaire-immeuble" className="mb-1.5 block text-xs font-semibold text-slate-700">Propriétaire *</label><select id="proprietaire-immeuble" required value={formulaire.proprietaireId} onChange={(e) => setFormulaire({...formulaire, proprietaireId:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Sélectionner</option>{proprietaires.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}</select></div></div>
            {erreurFormulaire && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{erreurFormulaire}</p>}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => { setModalOuvert(false); setErreurFormulaire(""); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">{editionId === null ? "Ajouter l'immeuble" : "Enregistrer les modifications"}</button></div>
          </form>
        </div>
      </div>}
    </CadreApplication>
  );
}
