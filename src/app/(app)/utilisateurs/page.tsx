"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  UserPlus, Search, Download, Pencil, Users, ShieldCheck,
  UserRoundCheck, UserRoundX, X, Mail, Phone, BriefcaseBusiness
} from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { exporterCsv } from "@/lib/export/csv";
import {
  depotUtilisateursEquipeDemo,
  ROLES_EQUIPE_COFIS,
  type RoleEquipeCofis,
  type StatutCompteEquipe,
  type UtilisateurEquipe
} from "@/lib/donnees/utilisateurs-equipe";

type FormulaireEquipe = Omit<UtilisateurEquipe, "id" | "statut" | "dateCreation">;

const formulaireVide: FormulaireEquipe = { nom: "", email: "", telephone: "", role: "Gestionnaire immobilier" };

const descriptionsRoles: Record<RoleEquipeCofis, string> = {
  Administrateur: "Administration générale et paramétrage de la plateforme.",
  "Gestionnaire immobilier": "Intégration des biens, suivi des locataires et gestion des baux.",
  Comptable: "Cycle mensuel du loyer, paiements et suivi des dépenses.",
  Direction: "Pilotage de l'activité, consultation des indicateurs et suivi des reversements."
};

const dateDuJour = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function PageUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurEquipe[]>([]);
  const [initialise, setInitialise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState<"Tous" | RoleEquipeCofis>("Tous");
  const [filtreStatut, setFiltreStatut] = useState<"Tous" | StatutCompteEquipe>("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<number | null>(null);
  const [formulaire, setFormulaire] = useState<FormulaireEquipe>(formulaireVide);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let actif = true;
    void depotUtilisateursEquipeDemo.lister().then((donnees) => {
      if (actif) setUtilisateurs(donnees);
    }).finally(() => {
      if (actif) setInitialise(true);
    });
    return () => { actif = false; };
  }, []);

  useEffect(() => {
    if (!initialise) return;
    void depotUtilisateursEquipeDemo.enregistrer(utilisateurs).catch(() => {
      // Les données restent affichées même si le stockage local est indisponible.
    });
  }, [utilisateurs, initialise]);

  const utilisateursFiltres = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    return utilisateurs.filter((utilisateur) => {
      const correspondRecherche = !terme || [
        utilisateur.nom, utilisateur.email, utilisateur.telephone, utilisateur.role
      ].some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme));
      return correspondRecherche &&
        (filtreRole === "Tous" || utilisateur.role === filtreRole) &&
        (filtreStatut === "Tous" || utilisateur.statut === filtreStatut);
    }).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  }, [utilisateurs, recherche, filtreRole, filtreStatut]);

  const ouvrirCreation = () => {
    setEditionId(null);
    setFormulaire(formulaireVide);
    setErreur("");
    setModalOuvert(true);
  };

  const ouvrirEdition = (utilisateur: UtilisateurEquipe) => {
    setEditionId(utilisateur.id);
    setFormulaire({
      nom: utilisateur.nom,
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      role: utilisateur.role
    });
    setErreur("");
    setModalOuvert(true);
  };

  const enregistrer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    setErreur("");
    const nom = formulaire.nom.trim();
    const email = formulaire.email.trim().toLocaleLowerCase("fr");
    const telephone = formulaire.telephone.trim();

    if (!nom || !email) {
      setErreur("Le nom et l'adresse e-mail sont obligatoires.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErreur("Saisissez une adresse e-mail valide.");
      return;
    }
    if (!ROLES_EQUIPE_COFIS.includes(formulaire.role)) {
      setErreur("Sélectionnez un profil valide.");
      return;
    }
    const doublon = utilisateurs.some((utilisateur) =>
      utilisateur.id !== editionId && utilisateur.email.trim().toLocaleLowerCase("fr") === email
    );
    if (doublon) {
      setErreur("Cette adresse e-mail est déjà présente dans le répertoire.");
      return;
    }

    const champs = { nom, email, telephone, role: formulaire.role };
    if (editionId !== null) {
      setUtilisateurs((liste) => liste.map((utilisateur) =>
        utilisateur.id === editionId ? { ...utilisateur, ...champs } : utilisateur
      ));
    } else {
      setUtilisateurs((liste) => [{
        id: Date.now(),
        ...champs,
        statut: "Actif",
        dateCreation: dateDuJour()
      }, ...liste]);
    }
    setModalOuvert(false);
    setFormulaire(formulaireVide);
  };

  const changerStatut = (id: number) => {
    setUtilisateurs((liste) => liste.map((utilisateur) =>
      utilisateur.id === id
        ? { ...utilisateur, statut: utilisateur.statut === "Actif" ? "Inactif" : "Actif" }
        : utilisateur
    ));
  };

  const exporter = () => exporterCsv({
    nomFichier: "cofis-equipe-demo.csv",
    entetes: ["Nom", "E-mail", "Téléphone", "Profil", "Statut", "Date d'ajout"],
    lignes: utilisateursFiltres.map((utilisateur) => [
      utilisateur.nom, utilisateur.email, utilisateur.telephone,
      utilisateur.role, utilisateur.statut, utilisateur.dateCreation
    ])
  });

  const actifs = utilisateurs.filter((utilisateur) => utilisateur.statut === "Actif").length;
  const inactifs = utilisateurs.length - actifs;

  return (
    <CadreApplication>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Administration</span><span>/</span><span className="font-medium text-slate-600">Utilisateurs</span></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Équipe & utilisateurs</h2>
            <p className="mt-1 text-sm text-slate-500">Répertoriez les collaborateurs COFIS et associez-leur un profil métier.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exporter} disabled={!initialise || utilisateursFiltres.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"><Download size={16} /> Exporter CSV</button>
            <button type="button" onClick={ouvrirCreation} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"><UserPlus size={17} /> Ajouter un utilisateur</button>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p className="text-xs font-semibold text-amber-900">Répertoire de démonstration — aucun compte de connexion n'est créé</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-800">Les fiches et statuts sont enregistrés dans le navigateur. L'attribution d'un profil est indicative : les droits d'accès réels, les identifiants et l'authentification seront configurés après validation de la matrice des permissions par COFIS.</p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Collaborateurs répertoriés</span><Users size={19} className="text-blue-600" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{initialise ? utilisateurs.length : "—"}</p><p className="mt-1 text-xs text-slate-400">Fiches de l'équipe COFIS</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Fiches actives</span><UserRoundCheck size={19} className="text-emerald-600" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{initialise ? actifs : "—"}</p><p className="mt-1 text-xs text-slate-400">Statut déclaré dans le répertoire</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>Fiches inactives</span><UserRoundX size={19} className="text-slate-500" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{initialise ? inactifs : "—"}</p><p className="mt-1 text-xs text-slate-400">Sans suppression de l'historique local</p></article>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ROLES_EQUIPE_COFIS.map((role) => {
            const nombre = utilisateurs.filter((utilisateur) => utilisateur.role === role).length;
            return <article key={role} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ShieldCheck size={17} /></span><span className="text-xs font-semibold text-slate-800">{role}</span></div><p className="mt-3 text-2xl font-bold text-slate-900">{initialise ? nombre : "—"}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{descriptionsRoles[role]}</p></article>;
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
            <div><h3 className="text-sm font-bold text-slate-900">Répertoire de l'équipe</h3><p className="mt-1 text-xs text-slate-400">{utilisateursFiltres.length} fiche(s) affichée(s)</p></div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="relative sm:col-span-3 xl:col-span-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Rechercher un utilisateur" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Nom, e-mail, téléphone..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white" /></div>
              <select aria-label="Filtrer par profil" value={filtreRole} onChange={(e) => setFiltreRole(e.target.value as "Tous" | RoleEquipeCofis)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600"><option value="Tous">Tous les profils</option>{ROLES_EQUIPE_COFIS.map((role) => <option key={role}>{role}</option>)}</select>
              <select aria-label="Filtrer par statut" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value as "Tous" | StatutCompteEquipe)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600"><option value="Tous">Tous les statuts</option><option>Actif</option><option>Inactif</option></select>
            </div>
          </div>

          {utilisateursFiltres.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><BriefcaseBusiness size={22} /></span>
              <p className="mt-4 text-sm font-semibold text-slate-800">{initialise && utilisateurs.length === 0 ? "Aucun collaborateur enregistré" : "Aucun résultat trouvé"}</p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">{initialise && utilisateurs.length === 0 ? "Ajoutez les membres de l'équipe COFIS pour constituer le répertoire. Les quatre profils métier sont déjà définis." : "Essayez de modifier les filtres ou le terme de recherche."}</p>
              {initialise && utilisateurs.length === 0 && <button type="button" onClick={ouvrirCreation} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"><UserPlus size={15} /> Ajouter le premier utilisateur</button>}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Collaborateur</th><th className="px-5 py-3">Profil</th><th className="px-5 py-3">Ajouté le</th><th className="px-5 py-3">Statut de fiche</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{utilisateursFiltres.map((utilisateur) => <tr key={utilisateur.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-xs font-semibold text-slate-800">{utilisateur.nom}</p><p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500"><Mail size={12} />{utilisateur.email}</p>{utilisateur.telephone && <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400"><Phone size={12} />{utilisateur.telephone}</p>}</td><td className="px-5 py-4"><span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">{utilisateur.role}</span></td><td className="px-5 py-4 text-xs text-slate-500">{new Date(utilisateur.dateCreation + "T12:00:00").toLocaleDateString("fr-FR")}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${utilisateur.statut === "Actif" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{utilisateur.statut}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => ouvrirEdition(utilisateur)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-blue-200 hover:text-blue-700" aria-label={`Modifier ${utilisateur.nom}`}><Pencil size={14} /></button><button type="button" onClick={() => changerStatut(utilisateur.id)} className="rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-700">{utilisateur.statut === "Actif" ? "Désactiver" : "Réactiver"}</button></div></td></tr>)}</tbody></table></div>
              <div className="divide-y divide-slate-100 md:hidden">{utilisateursFiltres.map((utilisateur) => <article key={utilisateur.id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{utilisateur.nom}</p><p className="mt-1 break-all text-xs text-slate-500">{utilisateur.email}</p>{utilisateur.telephone && <p className="mt-1 text-xs text-slate-400">{utilisateur.telephone}</p>}</div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${utilisateur.statut === "Actif" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{utilisateur.statut}</span></div><div className="flex items-center justify-between gap-2"><span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">{utilisateur.role}</span><div className="flex gap-2"><button type="button" onClick={() => ouvrirEdition(utilisateur)} className="rounded-lg border border-slate-200 p-2 text-slate-500" aria-label={`Modifier ${utilisateur.nom}`}><Pencil size={14} /></button><button type="button" onClick={() => changerStatut(utilisateur.id)} className="rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-semibold text-slate-600">{utilisateur.statut === "Actif" ? "Désactiver" : "Réactiver"}</button></div></div></article>)}</div>
            </>
          )}
        </section>
      </div>

      {modalOuvert && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOuvert(false); }}><section role="dialog" aria-modal="true" aria-labelledby="titre-modal-utilisateur" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"><div className="mb-5 flex items-start justify-between"><div><h3 id="titre-modal-utilisateur" className="text-lg font-bold text-slate-900">{editionId === null ? "Ajouter un collaborateur" : "Modifier le collaborateur"}</h3><p className="mt-1 text-xs text-slate-500">Renseignez les informations professionnelles et le profil COFIS.</p></div><button type="button" aria-label="Fermer" onClick={() => setModalOuvert(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div>
        <form onSubmit={enregistrer} className="space-y-4"><label className="block text-xs font-semibold text-slate-600">Nom complet *<input autoFocus required value={formulaire.nom} onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} placeholder="Nom et prénom" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-xs font-semibold text-slate-600">Adresse e-mail professionnelle *<input required type="email" value={formulaire.email} onChange={(e) => setFormulaire({ ...formulaire, email: e.target.value })} placeholder="nom@cofis.cm" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-xs font-semibold text-slate-600">Téléphone<input type="tel" value={formulaire.telephone} onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })} placeholder="+237 6XX XXX XXX" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-xs font-semibold text-slate-600">Profil métier *<select required value={formulaire.role} onChange={(e) => setFormulaire({ ...formulaire, role: e.target.value as RoleEquipeCofis })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal">{ROLES_EQUIPE_COFIS.map((role) => <option key={role}>{role}</option>)}</select></label><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-semibold text-slate-700">{formulaire.role}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{descriptionsRoles[formulaire.role]}</p></div>{erreur && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{erreur}</p>}<div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalOuvert(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">{editionId === null ? "Ajouter au répertoire" : "Enregistrer les modifications"}</button></div></form>
      </section></div>}
    </CadreApplication>
  );
}
