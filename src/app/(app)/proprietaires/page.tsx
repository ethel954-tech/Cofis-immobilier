"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownUp,
  Building2,
  ChevronDown,
  CirclePlus,
  Download,
  Ellipsis,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  SlidersHorizontal,
  Users,
  X
} from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";

type TypeProprietaire = "Particulier" | "Société";

type Proprietaire = {
  id: number;
  nom: string;
  type: TypeProprietaire;
  telephone: string;
  email: string;
  ville: string;
  biens: number;
};

const proprietairesInitiaux: Proprietaire[] = [
  { id: 1, nom: "Exemple — Jean Mbarga", type: "Particulier", telephone: "+237 6 90 00 00 01", email: "jean.exemple@cofis.cm", ville: "Yaoundé", biens: 3 },
  { id: 2, nom: "Exemple — Société Immobilière", type: "Société", telephone: "+237 6 90 00 00 02", email: "contact.exemple@cofis.cm", ville: "Douala", biens: 8 },
  { id: 3, nom: "Exemple — Marie Nguemo", type: "Particulier", telephone: "+237 6 90 00 00 03", email: "marie.exemple@cofis.cm", ville: "Bafoussam", biens: 1 }
];

const CLE_STOCKAGE_PROPRIETAIRES = "cofis_demo_proprietaires_v1";

const formulaireVide = {
  nom: "",
  type: "Particulier" as TypeProprietaire,
  telephone: "",
  email: "",
  ville: ""
};

export default function PageProprietaires() {
  const [proprietaires, setProprietaires] = useState(proprietairesInitiaux);
  const [stockageInitialise, setStockageInitialise] = useState(false);

  useEffect(() => {
    try {
      const donneesEnregistrees = window.localStorage.getItem(CLE_STOCKAGE_PROPRIETAIRES);
      if (donneesEnregistrees) {
        const proprietairesEnregistres: unknown = JSON.parse(donneesEnregistrees);
        if (Array.isArray(proprietairesEnregistres)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydratation des données de démonstration depuis localStorage.
          setProprietaires(proprietairesEnregistres as Proprietaire[]);
        }
      }
    } catch {
      // En cas de stockage illisible, conserver les données de démonstration initiales.
    } finally {
      setStockageInitialise(true);
    }
  }, []);

  useEffect(() => {
    if (!stockageInitialise) return;
    try {
      window.localStorage.setItem(CLE_STOCKAGE_PROPRIETAIRES, JSON.stringify(proprietaires));
    } catch {
      // L'interface reste utilisable même si le navigateur bloque le stockage local.
    }
  }, [proprietaires, stockageInitialise]);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<"Tous" | TypeProprietaire>("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<number | null>(null);
  const [formulaire, setFormulaire] = useState(formulaireVide);
  const [menuId, setMenuId] = useState<number | null>(null);

  const proprietairesFiltres = useMemo(() => proprietaires.filter((proprietaire) => {
    const correspondAuFiltre = filtre === "Tous" || proprietaire.type === filtre;
    const terme = recherche.trim().toLocaleLowerCase("fr");
    const correspondARecherche = !terme || [proprietaire.nom, proprietaire.email, proprietaire.telephone, proprietaire.ville]
      .some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme));
    return correspondAuFiltre && correspondARecherche;
  }), [proprietaires, filtre, recherche]);

  const ouvrirCreation = () => {
    setEditionId(null);
    setFormulaire(formulaireVide);
    setModalOuvert(true);
  };

  const ouvrirEdition = (proprietaire: Proprietaire) => {
    setEditionId(proprietaire.id);
    setFormulaire({
      nom: proprietaire.nom,
      type: proprietaire.type,
      telephone: proprietaire.telephone,
      email: proprietaire.email,
      ville: proprietaire.ville
    });
    setMenuId(null);
    setModalOuvert(true);
  };

  const enregistrer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (editionId !== null) {
      setProprietaires((liste) => liste.map((element) => element.id === editionId ? { ...element, ...formulaire } : element));
    } else {
      setProprietaires((liste) => [{ id: Date.now(), ...formulaire, biens: 0 }, ...liste]);
    }
    setModalOuvert(false);
    setFormulaire(formulaireVide);
  };

  return (
    <CadreApplication>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Patrimoine</span><span>/</span><span className="font-medium text-slate-600">Propriétaires</span></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Propriétaires</h2>
            <p className="mt-1 text-sm text-slate-500">Centralisez les informations des propriétaires et leurs biens immobiliers.</p>
          </div>
          <button onClick={ouvrirCreation} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700">
            <CirclePlus size={17} /> Ajouter un propriétaire
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Total propriétaires</span><span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Users size={18} /></span></div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{proprietaires.length}</p>
            <p className="mt-1 text-xs text-slate-400">Fiches dans cette démonstration</p>
          </article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Particuliers</span><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700"><Users size={18} /></span></div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{proprietaires.filter((p) => p.type === "Particulier").length}</p>
            <p className="mt-1 text-xs text-slate-400">Personnes physiques</p>
          </article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Sociétés</span><span className="rounded-xl bg-sky-50 p-2.5 text-sky-700"><Building2 size={18} /></span></div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{proprietaires.filter((p) => p.type === "Société").length}</p>
            <p className="mt-1 text-xs text-slate-400">Personnes morales</p>
          </article>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
            <div><h3 className="text-sm font-bold text-slate-900">Répertoire des propriétaires</h3><p className="mt-1 text-xs text-slate-400">{proprietairesFiltres.length} résultat(s)</p></div>
            <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-400" title="Disponible après connexion des données"><Download size={14} /> Exporter</button>
          </div>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un nom, e-mail, téléphone..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
            <div className="flex items-center gap-2"><SlidersHorizontal size={15} className="text-slate-400" /><div className="flex rounded-xl bg-slate-100 p-1">{(["Tous", "Particulier", "Société"] as const).map((option) => <button key={option} onClick={() => setFiltre(option)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${filtre === option ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{option}</button>)}</div></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50/80"><tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Propriétaire</th><th className="px-4 py-3">Coordonnées</th><th className="px-4 py-3">Localisation</th><th className="px-4 py-3">Biens liés</th><th className="px-4 py-3">Type</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {proprietairesFiltres.map((proprietaire) => (
                  <tr key={proprietaire.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700">{proprietaire.nom.split(/\s+/).filter(Boolean).slice(0, 2).map((mot) => mot[0]).join("").slice(0, 2).toUpperCase()}</span><div><p className="text-xs font-semibold text-slate-800">{proprietaire.nom}</p><p className="mt-1 text-[10px] text-slate-400">Réf. PROP-{String(proprietaire.id).slice(-4)}</p></div></div></td>
                    <td className="px-4 py-4"><div className="space-y-1.5"><p className="flex items-center gap-2 text-[11px] text-slate-600"><Phone size={12} className="text-slate-400" />{proprietaire.telephone || "Non renseigné"}</p><p className="flex items-center gap-2 text-[11px] text-slate-500"><Mail size={12} className="text-slate-400" />{proprietaire.email || "Non renseigné"}</p></div></td>
                    <td className="px-4 py-4"><span className="flex items-center gap-1.5 text-[11px] text-slate-600"><MapPin size={13} className="text-slate-400" />{proprietaire.ville || "Non renseignée"}</span></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"><Building2 size={13} />{proprietaire.biens}</span></td>
                    <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${proprietaire.type === "Société" ? "bg-indigo-50 text-indigo-700" : "bg-blue-50 text-blue-700"}`}>{proprietaire.type}</span></td>
                    <td className="px-5 py-4 text-right"><div className="relative inline-block"><button onClick={() => setMenuId(menuId === proprietaire.id ? null : proprietaire.id)} aria-label={`Actions pour ${proprietaire.nom}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Ellipsis size={17} /></button>{menuId === proprietaire.id && <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl"><button onClick={() => ouvrirEdition(proprietaire)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Pencil size={13} /> Modifier</button></div>}</div></td>
                  </tr>
                ))}
                {proprietairesFiltres.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Users size={20} /></div><p className="mt-3 text-sm font-semibold text-slate-700">Aucun propriétaire trouvé</p><p className="mt-1 text-xs text-slate-400">Modifiez votre recherche ou ajoutez un propriétaire.</p></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400"><span>Affichage de {proprietairesFiltres.length} sur {proprietaires.length} fiche(s)</span><span>Les données affichées sont fictives.</span></div>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4"><span className="mt-0.5 text-amber-700"><ArrowDownUp size={16} /></span><div><p className="text-xs font-semibold text-amber-900">Mode démonstration</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Les fiches sont fictives et conservées uniquement dans le stockage local de ce navigateur pour cette démonstration. Elles ne sont pas synchronisées avec une base de données ni partagées avec d'autres utilisateurs. N'y saisissez pas de données personnelles réelles.</p></div></div>
      </div>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOuvert(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="titre-modal" className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-modal" className="text-base font-bold text-slate-900">{editionId === null ? "Ajouter un propriétaire" : "Modifier le propriétaire"}</h3><p className="mt-1 text-xs text-slate-500">Renseignez les coordonnées principales.</p></div><button onClick={() => setModalOuvert(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17} /></button></div>
          <form onSubmit={enregistrer} className="space-y-4 p-5">
            <div><label htmlFor="nom" className="mb-1.5 block text-xs font-semibold text-slate-700">Nom complet ou raison sociale <span className="text-red-500">*</span></label><input id="nom" required value={formulaire.nom} onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} placeholder="Ex. : Jean Mbarga" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
            <div><label htmlFor="type" className="mb-1.5 block text-xs font-semibold text-slate-700">Type de propriétaire</label><div className="relative"><select id="type" value={formulaire.type} onChange={(e) => setFormulaire({ ...formulaire, type: e.target.value as TypeProprietaire })} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"><option>Particulier</option><option>Société</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="telephone" className="mb-1.5 block text-xs font-semibold text-slate-700">Téléphone</label><input id="telephone" type="tel" value={formulaire.telephone} onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })} placeholder="+237 6XX XXX XXX" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div><div><label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">Adresse e-mail</label><input id="email" type="email" value={formulaire.email} onChange={(e) => setFormulaire({ ...formulaire, email: e.target.value })} placeholder="nom@exemple.cm" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div></div>
            <div><label htmlFor="ville" className="mb-1.5 block text-xs font-semibold text-slate-700">Ville</label><input id="ville" value={formulaire.ville} onChange={(e) => setFormulaire({ ...formulaire, ville: e.target.value })} placeholder="Ex. : Douala" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">{editionId === null ? "Ajouter la fiche" : "Enregistrer les modifications"}</button></div>
          </form>
        </div>
      </div>}
    </CadreApplication>
  );
}
