"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Building2, Download, FileText, Home, Users, UserRound, Wrench } from "lucide-react";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { exporterCsv } from "@/lib/export/csv";

type Immeuble={id:number;nom:string;ville:string;statut?:string};
type Unite={id:number;reference:string;immeubleId:number;type:string;loyerMensuel:number;statut:string};
type Locataire={id:number;nom:string;type:string;ville:string;statut:string};
type Bail={id:number;reference:string;locataireId:number;uniteId:number;dateDebut:string;dateFin:string;loyerMensuel:number;statut:string};
type PaiementRapport={id:number;reference:string;datePaiement:string;montant:number};
type DepenseRapport={id:number;reference:string;dateDepense:string;montant:number};
type ProprietaireRapport={id:number};
type MaintenanceRapport={id:number;reference:string;priorite:string;dateSignalement:string;statut:string};
const exemples={
 immeubles:[{id:101,nom:"Résidence Les Manguiers",ville:"Yaoundé"},{id:102,nom:"Immeuble Bonapriso",ville:"Douala"},{id:103,nom:"Centre commercial Étoile",ville:"Yaoundé"}] as Immeuble[],
 unites:[{id:201,reference:"LM-A01",immeubleId:101,type:"Appartement",loyerMensuel:175000,statut:"Occupée"},{id:202,reference:"LM-A02",immeubleId:101,type:"Appartement",loyerMensuel:150000,statut:"Disponible"},{id:203,reference:"LM-S01",immeubleId:101,type:"Studio",loyerMensuel:85000,statut:"En maintenance"},{id:204,reference:"IB-B03",immeubleId:102,type:"Bureau",loyerMensuel:300000,statut:"Occupée"},{id:205,reference:"CE-B01",immeubleId:103,type:"Boutique",loyerMensuel:225000,statut:"Disponible"}] as Unite[],
 locataires:[{id:301,nom:"Exemple — Alice Tchoumi",type:"Particulier",ville:"Yaoundé",statut:"Actif"},{id:302,nom:"Exemple — Cabinet Horizon",type:"Entreprise",ville:"Douala",statut:"Prospect"},{id:303,nom:"Exemple — Paul Ndom",type:"Particulier",ville:"Bafoussam",statut:"Inactif"}] as Locataire[],
 baux:[{id:401,reference:"BAIL-2026-001",locataireId:301,uniteId:201,dateDebut:"2026-01-01",dateFin:"2026-12-31",loyerMensuel:175000,statut:"Actif"},{id:402,reference:"BAIL-2026-002",locataireId:302,uniteId:205,dateDebut:"2026-03-01",dateFin:"2027-02-28",loyerMensuel:225000,statut:"Brouillon"}] as Bail[]
};
const formatNombre=(n:number)=>new Intl.NumberFormat("fr-FR").format(n);
export default function PageRapports(){
 const [donnees,setDonnees]=useState(exemples);
 const [paiements,setPaiements]=useState<PaiementRapport[]>([]);
 const [depenses,setDepenses]=useState<DepenseRapport[]>([]);
 const [proprietaires,setProprietaires]=useState<ProprietaireRapport[]>([]);
 const [maintenance,setMaintenance]=useState<MaintenanceRapport[]>([]);
 const [pret,setPret]=useState(false);
 useEffect(()=>{
  const identifiant=window.setTimeout(()=>{
   const lire=<T,>(cle:string,defaut:T):T=>{
    try{const brut=localStorage.getItem(cle);if(!brut)return defaut;const v:unknown=JSON.parse(brut);return Array.isArray(v)?v.filter((element):element is T=>typeof element==="object"&&element!==null&&!Array.isArray(element)):defaut;}
    catch{return defaut;}
   };
   setDonnees({immeubles:lire("cofis_demo_immeubles_v1",exemples.immeubles),unites:lire("cofis_demo_unites_v1",exemples.unites),locataires:lire("cofis_demo_locataires_v1",exemples.locataires),baux:lire("cofis_demo_baux_v1",exemples.baux)});
   setPaiements(lire("cofis_demo_paiements_v1",[]));
   setDepenses(lire("cofis_demo_depenses_v1",[]));
   setProprietaires(lire("cofis_demo_proprietaires_v1",[]));
   setMaintenance(lire("cofis_demo_maintenance_v1",[]));
   setPret(true);
  },0);
  return()=>window.clearTimeout(identifiant);
 },[]);
 const stats=useMemo(()=>{
  const {immeubles,unites,locataires,baux}=donnees;
  return {
   immeubles:immeubles.length,unites:unites.length,locataires:locataires.length,baux:baux.length,
   disponibles:unites.filter(x=>x.statut==="Disponible").length,
   occupees:unites.filter(x=>x.statut==="Occupée").length,
   maintenance:unites.filter(x=>x.statut==="En maintenance").length,
   bauxActifs:baux.filter(x=>x.statut==="Actif").length,
   brouillons:baux.filter(x=>x.statut==="Brouillon").length,
   loyersActifs:baux.filter(x=>x.statut==="Actif").reduce((s,x)=>s+(Number.isSafeInteger(x.loyerMensuel)&&x.loyerMensuel>0?x.loyerMensuel:0),0),
   nombrePaiements:paiements.length,
   montantPaiements:paiements.reduce((s,x)=>s+(Number.isSafeInteger(x.montant)&&x.montant>0?x.montant:0),0),
   nombreDepenses:depenses.length,
   montantDepenses:depenses.reduce((s,x)=>s+(Number.isSafeInteger(x.montant)&&x.montant>0?x.montant:0),0),
   proprietaires:proprietaires.length,
   interventions:maintenance.length,
   interventionsOuvertes:maintenance.filter(x=>x.statut!=="Terminée").length,
   interventionsUrgentes:maintenance.filter(x=>x.priorite==="Urgente"&&x.statut!=="Terminée").length,
   interventionsTerminees:maintenance.filter(x=>x.statut==="Terminée").length
  };
 },[donnees,paiements,depenses,proprietaires,maintenance]);
 const exporter=()=>{
  exporterCsv({
   nomFichier:"cofis-rapport-demo.csv",
   entetes:["Indicateur","Valeur"],
   lignes:[
    ["Propriétaires",stats.proprietaires],
    ["Immeubles",stats.immeubles],
    ["Unités",stats.unites],
    ["Unités disponibles",stats.disponibles],
    ["Unités occupées (statut déclaré)",stats.occupees],
    ["Unités en maintenance",stats.maintenance],
    ["Locataires",stats.locataires],
    ["Baux",stats.baux],
    ["Baux actifs (statut déclaré)",stats.bauxActifs],
    ["Baux brouillons",stats.brouillons],
    ["Somme des loyers mensuels des baux actifs (FCFA)",stats.loyersActifs],
    ["Paiements consignés — nombre d'écritures",stats.nombrePaiements],
    ["Paiements consignés — montants déclarés (FCFA)",stats.montantPaiements],
    ["Dépenses consignées — nombre d'écritures",stats.nombreDepenses],
    ["Dépenses consignées — montants déclarés (FCFA)",stats.montantDepenses],
    ["Interventions consignées",stats.interventions],
    ["Interventions non terminées",stats.interventionsOuvertes],
    ["Interventions ouvertes — priorité urgente",stats.interventionsUrgentes],
    ["Interventions terminées",stats.interventionsTerminees]
   ]
  });
 };
 const carte=(titre:string,valeur:number,description:string,Icone:typeof Building2)=><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>{titre}</span><Icone size={19} className="text-blue-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{pret?formatNombre(valeur):"—"}</p><p className="mt-1 text-xs text-slate-400">{description}</p></article>;
 return <CadreApplication><div className="space-y-6">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span className="font-medium text-slate-600">Pilotage / Rapports</span></div><h2 className="text-2xl font-bold tracking-tight text-slate-900">Rapports & indicateurs</h2><p className="mt-1 text-sm text-slate-500">Une vue synthétique des données actuellement présentes dans cette démonstration.</p></div><button onClick={exporter} disabled={!pret} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><Download size={16}/> Exporter le résumé CSV</button></div>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{carte("Propriétaires",stats.proprietaires,"Fiches du répertoire",UserRound)}{carte("Immeubles",stats.immeubles,"Patrimoine référencé",Building2)}{carte("Unités / logements",stats.unites,"Espaces enregistrés",Home)}{carte("Locataires",stats.locataires,"Fiches du répertoire",Users)}{carte("Baux",stats.baux,"Dossiers enregistrés",FileText)}{carte("Interventions",stats.interventions,"Signalements consignés",Wrench)}</div>
  <div className="grid gap-5 xl:grid-cols-2">
   <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Home size={18} className="text-blue-600"/><h3 className="text-sm font-bold text-slate-900">État déclaré des unités</h3></div><div className="mt-5 space-y-4">{[{label:"Disponibles",n:stats.disponibles,color:"bg-emerald-500"},{label:"Occupées",n:stats.occupees,color:"bg-blue-600"},{label:"En maintenance",n:stats.maintenance,color:"bg-amber-500"}].map(x=><div key={x.label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">{x.label}</span><strong className="text-slate-800">{formatNombre(x.n)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${x.color}`} style={{width:`${stats.unites?Math.min(100,x.n/stats.unites*100):0}%`}}/></div></div>)}</div><p className="mt-5 text-[10px] text-slate-400">Les statuts sont ceux saisis dans les fiches, pas une occupation calculée à partir des contrats.</p></section>
   <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><FileText size={18} className="text-indigo-600"/><h3 className="text-sm font-bold text-slate-900">État déclaré des baux</h3></div><div className="mt-5 space-y-4">{[{label:"Actifs",n:stats.bauxActifs,color:"bg-emerald-500"},{label:"Brouillons",n:stats.brouillons,color:"bg-amber-500"},{label:"Autres statuts",n:Math.max(0,stats.baux-stats.bauxActifs-stats.brouillons),color:"bg-slate-400"}].map(x=><div key={x.label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">{x.label}</span><strong className="text-slate-800">{formatNombre(x.n)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${x.color}`} style={{width:`${stats.baux?Math.min(100,x.n/stats.baux*100):0}%`}}/></div></div>)}</div><p className="mt-5 text-[10px] text-slate-400">Le statut du bail est déclaratif et n'est pas recalculé automatiquement selon les dates.</p></section>
  </div>
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Wrench size={18} className="text-blue-600"/><h3 className="text-sm font-bold text-slate-900">Suivi des interventions</h3></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[{label:"Non terminées",value:stats.interventionsOuvertes},{label:"Priorité urgente",value:stats.interventionsUrgentes},{label:"Terminées",value:stats.interventionsTerminees}].map(x=><div key={x.label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{x.label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{pret?formatNombre(x.value):"—"}</p></div>)}</div><p className="mt-4 text-[10px] leading-5 text-slate-400">Comptage des statuts et priorités déclarés dans le registre local. Ce suivi ne confirme ni la réalisation effective, ni le coût, ni la validation d'une intervention.</p></section>
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><BarChart3 size={18} className="text-blue-600"/><h3 className="text-sm font-bold text-slate-900">Indicateur locatif indicatif</h3></div><p className="mt-4 text-2xl font-bold text-slate-900">{formatNombre(stats.loyersActifs)} FCFA <span className="text-sm font-medium text-slate-500">/ mois</span></p><p className="mt-1 text-xs text-slate-500">Somme des loyers mensuels enregistrés sur les baux au statut « Actif ».</p><p className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">Ce chiffre n'est ni un revenu encaissé, ni une prévision, ni un solde comptable. Il ne tient pas compte des échéances, paiements, impayés, charges, commissions ou reversements.</p></section>
  <section className="grid gap-4 sm:grid-cols-2">
   <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900">Paiements consignés</h3><Download size={17} className="text-blue-600"/></div><p className="mt-4 text-2xl font-bold text-slate-900">{pret?formatNombre(stats.montantPaiements):"—"} FCFA</p><p className="mt-1 text-xs text-slate-500">{pret?formatNombre(stats.nombrePaiements):"—"} écriture(s) dans le registre</p><p className="mt-3 text-[10px] leading-5 text-slate-400">Montants déclarés dans le registre local, sans affectation à des échéances ni rapprochement.</p></article>
   <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900">Dépenses consignées</h3><FileText size={17} className="text-indigo-600"/></div><p className="mt-4 text-2xl font-bold text-slate-900">{pret?formatNombre(stats.montantDepenses):"—"} FCFA</p><p className="mt-1 text-xs text-slate-500">{pret?formatNombre(stats.nombreDepenses):"—"} écriture(s) dans le registre</p><p className="mt-3 text-[10px] leading-5 text-slate-400">Montants déclarés dans le registre local, sans approbation ni imputation à un propriétaire.</p></article>
  </section>
  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-xs font-semibold text-amber-900">Rapports de démonstration</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Les indicateurs sont calculés dans le navigateur à partir des données locales. Les montants des paiements et dépenses sont des sommes de saisie, pas des soldes, revenus nets, dépenses approuvées ou montants rapprochés. Aucun rapport comptable ou financier officiel n'est produit.</p></div>
 </div></CadreApplication>;
}
