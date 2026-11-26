"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Home, Wallet, ArrowDownLeft, MapPin, CalendarDays, ChevronDown, LayoutDashboard, LogOut, ShieldCheck, ArrowUpRight, CircleHelp } from "lucide-react";

type Proprietaire = { id: number; nom: string; email: string; telephone: string; ville: string };
type Immeuble = { id: number; nom: string; adresse: string; ville: string; proprietaireId: number; statut: string };
type Unite = { id: number; reference: string; immeubleId: number; type: string; etage: string; surface: number | null; loyerMensuel: number; statut: string };
type Bail = { id: number; reference: string; locataireId: number; uniteId: number; loyerMensuel: number; statut: string };
type Locataire = { id: number; nom: string };
type Paiement = { id: number; reference: string; bailId: number; datePaiement: string; montant: number; mode: string };

const exemples = {
  proprietaires: [{ id: 1, nom: "Exemple — Jean Mbarga", email: "jean.exemple@cofis.cm", telephone: "+237 6 90 00 00 01", ville: "Yaoundé" }],
  immeubles: [{ id: 101, nom: "Résidence Les Manguiers", adresse: "Quartier Bastos", ville: "Yaoundé", proprietaireId: 1, statut: "Actif" }],
  unites: [
    { id: 201, reference: "LM-A01", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 85, loyerMensuel: 175000, statut: "Occupée" },
    { id: 202, reference: "LM-A02", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 72, loyerMensuel: 150000, statut: "Disponible" },
    { id: 203, reference: "LM-S01", immeubleId: 101, type: "Studio", etage: "Rez-de-chaussée", surface: 38, loyerMensuel: 85000, statut: "En maintenance" }
  ],
  locataires: [{ id: 301, nom: "Exemple — Alice Tchoumi" }],
  baux: [{ id: 401, reference: "BAIL-2026-001", locataireId: 301, uniteId: 201, loyerMensuel: 175000, statut: "Actif" }],
  paiements: [
    { id: 501, reference: "PAY-DEMO-001", bailId: 401, datePaiement: "2026-11-05", montant: 175000, mode: "Virement bancaire" },
    { id: 502, reference: "PAY-DEMO-002", bailId: 401, datePaiement: "2026-10-05", montant: 100000, mode: "Mobile Money" }
  ]
};

function lireListe<T>(cle: string, defaut: T[]): T[] {
  try {
    const brut = window.localStorage.getItem(cle);
    if (!brut) return defaut;
    const valeur: unknown = JSON.parse(brut);
    return Array.isArray(valeur) ? valeur as T[] : defaut;
  } catch { return defaut; }
}
const montant = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " FCFA";
const dateFr = (s: string) => new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(s + "T00:00:00"));

export default function EspaceProprietairePage() {
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([]);
  const [immeubles, setImmeubles] = useState<Immeuble[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [baux, setBaux] = useState<Bail[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [proprietaireId, setProprietaireId] = useState(1);
  const [onglet, setOnglet] = useState("apercu");
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    setProprietaires(lireListe("cofis_demo_proprietaires_v1", exemples.proprietaires));
    setImmeubles(lireListe("cofis_demo_immeubles_v1", exemples.immeubles));
    setUnites(lireListe("cofis_demo_unites_v1", exemples.unites));
    setLocataires(lireListe("cofis_demo_locataires_v1", exemples.locataires));
    setBaux(lireListe("cofis_demo_baux_v1", exemples.baux));
    setPaiements(lireListe("cofis_demo_paiements_v1", exemples.paiements));
    setCharge(true);
  }, []);

  const proprietaire = proprietaires.find((p) => p.id === proprietaireId) || proprietaires[0];
  const biens = useMemo(() => immeubles.filter((b) => b.proprietaireId === proprietaire?.id), [immeubles, proprietaire]);
  const idsBiens = new Set(biens.map((b) => b.id));
  const lots = unites.filter((u) => idsBiens.has(u.immeubleId));
  const idsLots = new Set(lots.map((u) => u.id));
  const bauxDuProprietaire = baux.filter((b) => idsLots.has(b.uniteId));
  const idsBaux = new Set(bauxDuProprietaire.map((b) => b.id));
  const mouvements = paiements.filter((p) => idsBaux.has(p.bailId)).sort((a, b) => b.datePaiement.localeCompare(a.datePaiement));
  const loyersActifs = bauxDuProprietaire.filter((b) => b.statut === "Actif").reduce((s, b) => s + b.loyerMensuel, 0);
  const totalPaiements = mouvements.reduce((s, p) => s + p.montant, 0);
  const occupes = lots.filter((u) => u.statut === "Occupée").length;

  const nav = [
    { id: "apercu", label: "Vue d’ensemble", icon: LayoutDashboard },
    { id: "biens", label: "Mon patrimoine", icon: Building2 },
    { id: "finances", label: "Finances", icon: Wallet }
  ];

  return <div className="min-h-screen bg-[#f4f7fc] text-slate-900">
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white"><Building2 size={21} /></span>
          <span><strong className="block text-lg font-black tracking-tight">COFIS<span className="text-blue-700">.</span></strong><span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400">Espace propriétaire</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-500 sm:block">Portail client · Démonstration</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">{proprietaire?.nom?.slice(0, 1) || "P"}</span>
          <span className="hidden max-w-[180px] truncate text-sm font-semibold sm:block">{proprietaire?.nom || "Propriétaire"}</span>
          <Link href="/connexion" aria-label="Quitter l’espace" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><LogOut size={17} /></Link>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10 lg:py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-700">Votre espace personnel</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Bonjour{proprietaire ? ", " + proprietaire.nom.split(" ")[0] : ""} 👋</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Retrouvez vos biens, leur occupation et les mouvements financiers enregistrés par votre gestionnaire.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="profil-proprietaire" className="text-xs font-semibold text-slate-500">Profil de démonstration</label>
          <div className="relative">
            <select id="profil-proprietaire" value={proprietaire?.id || proprietaireId} onChange={(e) => setProprietaireId(Number(e.target.value))} className="min-w-[210px] appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
              {proprietaires.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm" aria-label="Navigation du portail">
          {nav.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setOnglet(item.id)} className={"inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition " + (onglet === item.id ? "bg-blue-700 text-white shadow-md" : "text-slate-500 hover:bg-slate-50")}><Icon size={16} />{item.label}</button>; })}
        </nav>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800"><ShieldCheck size={13} /> Données de démonstration</span>
      </div>

      {!charge ? <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">Chargement de votre espace…</div> : !proprietaire ? <div className="rounded-2xl border bg-white p-10 text-center"><Building2 className="mx-auto text-slate-300" size={32} /><h2 className="mt-3 font-bold">Aucun profil propriétaire</h2><p className="mt-1 text-sm text-slate-500">Ajoutez un propriétaire dans l’espace de gestion pour alimenter cette démonstration.</p><Link href="/proprietaires" className="mt-4 inline-flex rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">Ouvrir la gestion</Link></div> : <>
        {onglet === "apercu" && <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Biens immobiliers", value: String(biens.length), note: "Immeubles rattachés", icon: Building2 },
              { label: "Logements occupés", value: occupes + " / " + lots.length, note: "Occupation déclarée", icon: Home },
              { label: "Loyers mensuels actifs", value: montant(loyersActifs), note: "Selon les baux marqués actifs", icon: Wallet },
              { label: "Paiements consignés", value: montant(totalPaiements), note: "Somme des écritures de démonstration", icon: ArrowDownLeft }
            ].map((kpi) => { const Icon = kpi.icon; return <article key={kpi.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">{kpi.label}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={18} /></span></div><p className="mt-5 break-words text-2xl font-bold tracking-tight">{charge ? kpi.value : "—"}</p><p className="mt-1 text-[11px] text-slate-400">{kpi.note}</p></article>; })}
          </section>
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="font-bold">Vos biens immobiliers</h2><p className="mt-1 text-xs text-slate-400">Aperçu du patrimoine confié à l’agence</p></div><button onClick={() => setOnglet("biens")} className="text-xs font-bold text-blue-700">Tout voir <ArrowUpRight size={14} className="ml-1 inline" /></button></div>
              <div className="divide-y divide-slate-100">
                {biens.map((bien) => { const nombre = lots.filter((u) => u.immeubleId === bien.id).length; return <div key={bien.id} className="flex items-center gap-4 px-6 py-5"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Building2 size={21} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{bien.nom}</p><p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-400"><MapPin size={12} />{bien.adresse}, {bien.ville}</p></div><div className="text-right"><p className="text-sm font-bold">{nombre}</p><p className="text-[10px] text-slate-400">unité(s)</p></div></div>; })}
                {biens.length === 0 && <p className="px-6 py-10 text-center text-sm text-slate-400">Aucun bien n’est rattaché à ce profil.</p>}
              </div>
            </article>
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><CalendarDays size={18} /></span><div><h2 className="font-bold">Derniers mouvements</h2><p className="mt-1 text-xs text-slate-400">Historique saisi dans le registre</p></div></div>
              <div className="mt-5 space-y-4">
                {mouvements.slice(0, 4).map((p) => <div key={p.id} className="flex items-start gap-3"><span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><ArrowDownLeft size={15} /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{p.reference}</p><p className="mt-1 text-[11px] text-slate-400">{dateFr(p.datePaiement)} · {p.mode}</p></div><p className="whitespace-nowrap text-xs font-bold">+ {montant(p.montant)}</p></div>)}
                {mouvements.length === 0 && <p className="py-5 text-center text-xs text-slate-400">Aucun mouvement enregistré.</p>}
              </div>
              <button onClick={() => setOnglet("finances")} className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50">Consulter les finances</button>
            </article>
          </section>
        </>}

        {onglet === "biens" && <section className="grid gap-5 lg:grid-cols-2">
          {biens.map((bien) => { const lotsBien = lots.filter((u) => u.immeubleId === bien.id); return <article key={bien.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex h-28 items-end bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-600 p-6 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-100">Patrimoine immobilier</p><h2 className="mt-1 text-xl font-bold">{bien.nom}</h2></div></div><div className="p-6"><p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={15} />{bien.adresse}, {bien.ville}</p><div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Unités</p><p className="mt-1 text-xl font-bold">{lotsBien.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Occupées</p><p className="mt-1 text-xl font-bold">{lotsBien.filter((u) => u.statut === "Occupée").length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Disponibles</p><p className="mt-1 text-xl font-bold">{lotsBien.filter((u) => u.statut === "Disponible").length}</p></div></div><div className="mt-5 divide-y divide-slate-100">{lotsBien.map((u) => <div key={u.id} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{u.reference} <span className="font-normal text-slate-400">· {u.type}</span></p><p className="mt-1 text-[11px] text-slate-400">{u.etage}{u.surface ? " · " + u.surface + " m²" : ""}</p></div><div className="text-right"><p className="text-sm font-bold">{montant(u.loyerMensuel)}</p><span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">{u.statut}</span></div></div>)}</div></div></article>; })}
          {biens.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">Aucun immeuble n’est rattaché à ce profil.</div>}
        </section>}

        {onglet === "finances" && <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-semibold text-slate-500">Loyers mensuels contractuels</p><p className="mt-3 text-2xl font-bold">{montant(loyersActifs)}</p><p className="mt-1 text-[11px] text-slate-400">Baux au statut actif</p></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-semibold text-slate-500">Paiements consignés</p><p className="mt-3 text-2xl font-bold">{montant(totalPaiements)}</p><p className="mt-1 text-[11px] text-slate-400">Écritures locales liées aux baux</p></article></div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><h2 className="font-bold">Historique des paiements</h2><p className="mt-1 text-xs text-slate-400">Mouvements enregistrés par l’agence pour les baux de vos biens</p></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">Référence</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Locataire</th><th className="px-6 py-3">Mode</th><th className="px-6 py-3 text-right">Montant</th></tr></thead><tbody className="divide-y divide-slate-100">{mouvements.map((p) => { const bail = bauxDuProprietaire.find((b) => b.id === p.bailId); const locataire = locataires.find((l) => l.id === bail?.locataireId); return <tr key={p.id}><td className="px-6 py-4 font-semibold">{p.reference}</td><td className="px-6 py-4 text-slate-500">{dateFr(p.datePaiement)}</td><td className="px-6 py-4">{locataire?.nom || "—"}</td><td className="px-6 py-4 text-slate-500">{p.mode}</td><td className="px-6 py-4 text-right font-bold">{montant(p.montant)}</td></tr>; })}{mouvements.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Aucun paiement enregistré pour ce patrimoine.</td></tr>}</tbody></table></div></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><CircleHelp className="mt-0.5 shrink-0 text-amber-700" size={18} /><div><p className="text-sm font-bold text-amber-900">Limites de la démonstration</p><p className="mt-1 text-xs leading-5 text-amber-800">Ces montants sont des données de test locales. Ils ne constituent ni un relevé bancaire, ni un solde exigible, ni un calcul de reversement. Les paiements ne sont pas rapprochés des échéances.</p></div></div></div>
        </section>}
      </>}
      <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-[11px] text-slate-400 sm:flex-row"><p>© {new Date().getFullYear()} COFIS IMMOBILIER · Espace propriétaire</p><p>Une gestion immobilière plus claire, à chaque étape.</p></footer>
    </main>
  </div>;
}
