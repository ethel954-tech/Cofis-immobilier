"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Building2, CirclePlus, Mail, MapPin, Pencil, Phone, Search, Trash2, Users, X } from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";

type TypeLocataire = "Particulier" | "Entreprise";
type StatutLocataire = "Prospect" | "Actif" | "Inactif";
type Locataire = { id: number; nom: string; type: TypeLocataire; telephone: string; email: string; ville: string; statut: StatutLocataire };

const CLE_LOCATAIRES = "cofis_demo_locataires_v1";
const locatairesExemple: Locataire[] = [
  { id: 301, nom: "Exemple — Alice Tchoumi", type: "Particulier", telephone: "+237 6 70 00 00 11", email: "alice.exemple@cofis.cm", ville: "Yaoundé", statut: "Actif" },
  { id: 302, nom: "Exemple — Cabinet Horizon", type: "Entreprise", telephone: "+237 6 90 00 00 22", email: "contact.horizon@cofis.cm", ville: "Douala", statut: "Prospect" },
  { id: 303, nom: "Exemple — Paul Ndom", type: "Particulier", telephone: "+237 6 80 00 00 33", email: "paul.exemple@cofis.cm", ville: "Bafoussam", statut: "Inactif" },
];
const formulaireVide = { nom: "", type: "Particulier" as TypeLocataire, telephone: "", email: "", ville: "", statut: "Prospect" as StatutLocataire };

export default function PageLocataires() {
  const [locataires, setLocataires] = useState<Locataire[]>(locatairesExemple);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<"Tous" | StatutLocataire>("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<number | null>(null);
  const [formulaire, setFormulaire] = useState(formulaireVide);

  useEffect(() => {
    try {
      const stock = localStorage.getItem(CLE_LOCATAIRES);
      if (stock) {
        const parsed: unknown = JSON.parse(stock);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydratation des données de démonstration depuis localStorage.
        if (Array.isArray(parsed)) setLocataires(parsed as Locataire[]);
      }
    } catch {
      // Conserver les exemples si les données locales sont illisibles.
    } finally {
      setInitialise(true);
    }
  }, []);

  useEffect(() => {
    if (!initialise) return;
    try { localStorage.setItem(CLE_LOCATAIRES, JSON.stringify(locataires)); } catch { /* Stockage local indisponible. */ }
  }, [locataires, initialise]);

  const locatairesFiltres = useMemo(() => locataires.filter((locataire) => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    const correspondRecherche = !terme || [locataire.nom, locataire.telephone, locataire.email, locataire.ville].some((v) => v.toLocaleLowerCase("fr").includes(terme));
    return correspondRecherche && (filtreStatut === "Tous" || locataire.statut === filtreStatut);
  }), [locataires, recherche, filtreStatut]);

  const ouvrirCreation = () => { setEditionId(null); setFormulaire(formulaireVide); setModalOuvert(true); };
  const ouvrirEdition = (locataire: Locataire) => {
    setEditionId(locataire.id);
    setFormulaire({ nom: locataire.nom, type: locataire.type, telephone: locataire.telephone, email: locataire.email, ville: locataire.ville, statut: locataire.statut });
    setModalOuvert(true);
  };
  const enregistrer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const donnees: Locataire = { id: editionId ?? Date.now(), nom: formulaire.nom.trim(), type: formulaire.type, telephone: formulaire.telephone.trim(), email: formulaire.email.trim(), ville: formulaire.ville.trim(), statut: formulaire.statut };
    setLocataires((liste) => editionId === null ? [donnees, ...liste] : liste.map((l) => l.id === editionId ? donnees : l));
    setModalOuvert(false);
    setFormulaire(formulaireVide);
  };
  const supprimer = (locataire: Locataire) => {
    if (window.confirm(`Supprimer la fiche de démonstration « ${locataire.nom} » ?`)) setLocataires((liste) => liste.filter((l) => l.id !== locataire.id));
  };
  const couleurStatut: Record<StatutLocataire, string> = { Prospect: "bg-amber-50 text-amber-700", Actif: "bg-emerald-50 text-emerald-700", Inactif: "bg-slate-100 text-slate-500" };

  return (
    <CadreApplication>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Location</span><span>/</span><span className="font-medium text-slate-600">Locataires</span></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Locataires</h2>
            <p className="mt-1 text-sm text-slate-500">Centralisez les contacts des personnes et entreprises candidates ou locataires.</p>
          </div>
          <button onClick={ouvrirCreation} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"><CirclePlus size={17}/> Ajouter un locataire</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Total fiches</span><Users size={19} className="text-blue-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{locataires.length}</p><p className="mt-1 text-xs text-slate-400">Répertoire de démonstration</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Actifs</span><Users size={19} className="text-emerald-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{locataires.filter((l) => l.statut === "Actif").length}</p><p className="mt-1 text-xs text-slate-400">Statut de fiche déclaré</p></article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Entreprises</span><Building2 size={19} className="text-indigo-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{locataires.filter((l) => l.type === "Entreprise").length}</p><p className="mt-1 text-xs text-slate-400">Personnes morales</p></article>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h3 className="text-sm font-bold text-slate-900">Répertoire des locataires</h3><p className="mt-1 text-xs text-slate-400">{locatairesFiltres.length} résultat(s)</p></div><Users size={19} className="text-slate-400"/></div>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un nom, téléphone, e-mail..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{(["Tous", "Prospect", "Actif", "Inactif"] as const).map((statut) => <button key={statut} onClick={() => setFiltreStatut(statut)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${filtreStatut === statut ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{statut}</button>)}</div>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/80"><tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Locataire</th><th className="px-4 py-3">Coordonnées</th><th className="px-4 py-3">Ville</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Statut</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
            {locatairesFiltres.map((locataire) => <tr key={locataire.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700">{locataire.nom.split(/\s+/).filter(Boolean).slice(0,2).map((mot) => mot[0]).join("").slice(0,2).toUpperCase()}</span><div><p className="text-xs font-semibold text-slate-800">{locataire.nom}</p><p className="mt-1 text-[10px] text-slate-400">Réf. LOC-{String(locataire.id).slice(-4)}</p></div></div></td><td className="px-4 py-4"><div className="space-y-1.5"><p className="flex items-center gap-2 text-[11px] text-slate-600"><Phone size={12} className="text-slate-400"/>{locataire.telephone || "Non renseigné"}</p><p className="flex items-center gap-2 text-[11px] text-slate-500"><Mail size={12} className="text-slate-400"/>{locataire.email || "Non renseigné"}</p></div></td><td className="px-4 py-4"><span className="flex items-center gap-1.5 text-[11px] text-slate-600"><MapPin size={12} className="text-slate-400"/>{locataire.ville || "Non renseignée"}</span></td><td className="px-4 py-4 text-xs text-slate-600">{locataire.type}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${couleurStatut[locataire.statut]}`}>{locataire.statut}</span></td><td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button onClick={() => ouvrirEdition(locataire)} aria-label={`Modifier ${locataire.nom}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"><Pencil size={15}/></button><button onClick={() => supprimer(locataire)} aria-label={`Supprimer ${locataire.nom}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15}/></button></div></td></tr>)}
            {locatairesFiltres.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center"><Users className="mx-auto text-slate-300" size={24}/><p className="mt-3 text-sm font-semibold text-slate-700">Aucun locataire trouvé</p><p className="mt-1 text-xs text-slate-400">Modifiez votre recherche ou ajoutez une fiche.</p></td></tr>}
          </tbody></table></div>
          <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">Les données sont fictives et stockées localement dans ce navigateur.</div>
        </section>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-xs font-semibold text-amber-900">Mode démonstration</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Les coordonnées sont fictives et conservées uniquement dans le stockage local de ce navigateur. Aucune base de données n'est connectée. N'y saisissez pas de données personnelles réelles ni de pièces d'identité.</p></div>
      </div>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOuvert(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="titre-locataire" className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-locataire" className="text-base font-bold text-slate-900">{editionId === null ? "Ajouter un locataire" : "Modifier la fiche locataire"}</h3><p className="mt-1 text-xs text-slate-500">Les informations d'identité officielles seront gérées dans un flux sécurisé ultérieur.</p></div><button onClick={() => setModalOuvert(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17}/></button></div>
          <form onSubmit={enregistrer} className="space-y-4 p-5">
            <div><label htmlFor="nom-locataire" className="mb-1.5 block text-xs font-semibold text-slate-700">Nom complet ou raison sociale *</label><input id="nom-locataire" required value={formulaire.nom} onChange={(e) => setFormulaire({...formulaire, nom:e.target.value})} placeholder="Nom du locataire" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"/></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="type-locataire" className="mb-1.5 block text-xs font-semibold text-slate-700">Type</label><select id="type-locataire" value={formulaire.type} onChange={(e) => setFormulaire({...formulaire, type:e.target.value as TypeLocataire})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Particulier</option><option>Entreprise</option></select></div><div><label htmlFor="statut-locataire" className="mb-1.5 block text-xs font-semibold text-slate-700">Statut de la fiche</label><select id="statut-locataire" value={formulaire.statut} onChange={(e) => setFormulaire({...formulaire, statut:e.target.value as StatutLocataire})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Prospect</option><option>Actif</option><option>Inactif</option></select></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="telephone-locataire" className="mb-1.5 block text-xs font-semibold text-slate-700">Téléphone</label><input id="telephone-locataire" type="tel" value={formulaire.telephone} onChange={(e) => setFormulaire({...formulaire, telephone:e.target.value})} placeholder="+237 6XX XXX XXX" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div><div><label htmlFor="email-locataire" className="mb-1.5 block text-xs font-semibold text-slate-700">E-mail</label><input id="email-locataire" type="email" value={formulaire.email} onChange={(e) => setFormulaire({...formulaire, email:e.target.value})} placeholder="nom@exemple.cm" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div></div>
            <div><label htmlFor="ville-locataire" className="mb-1.5 block text-xs font-semibold text-slate-700">Ville</label><input id="ville-locataire" value={formulaire.ville} onChange={(e) => setFormulaire({...formulaire, ville:e.target.value})} placeholder="Yaoundé" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">{editionId === null ? "Ajouter la fiche" : "Enregistrer les modifications"}</button></div>
          </form>
        </div>
      </div>}
    </CadreApplication>
  );
}
