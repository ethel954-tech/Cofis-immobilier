"use client";

/* eslint react/no-unescaped-entities: "off" -- Apostrophes françaises dans les libellés JSX. */

import { useEffect, useState, type FormEvent } from "react";
import { FileText, CirclePlus, Search, Pencil, Trash2, X, CalendarDays, Home, Users, Wallet, Download } from "lucide-react";
import { exporterCsv } from "@/lib/export/csv";
import { CadreApplication } from "@/components/layout/CadreApplication";
import { depotBauxDemo, type Bail, type StatutBail } from "@/lib/donnees/baux";
import { depotLocatairesDemo, type Locataire } from "@/lib/donnees/locataires";
import { depotUnitesDemo, type Unite } from "@/lib/donnees/unites";
import { depotImmeublesDemo, type Immeuble } from "@/lib/donnees/immeubles";

const vide={reference:"",locataireId:"",uniteId:"",dateDebut:"",dateFin:"",loyerMensuel:"",depotGarantie:"0",statut:"Brouillon" as StatutBail,notes:""};
const montant=(n:number)=>new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(n)+" FCFA";

export default function PageBaux(){
 const [baux,setBaux]=useState<Bail[]>([]);
 const [locataires,setLocataires]=useState<Locataire[]>([]);
 const [unites,setUnites]=useState<Unite[]>([]);
 const [immeubles,setImmeubles]=useState<Immeuble[]>([]);
 const [initialise,setInitialise]=useState(false);
 const [recherche,setRecherche]=useState("");
 const [filtre,setFiltre]=useState<"Tous"|StatutBail>("Tous");
 const [dateDebut,setDateDebut]=useState("");
 const [dateFin,setDateFin]=useState("");
 const [modal,setModal]=useState(false);
 const [editionId,setEditionId]=useState<number|null>(null);
 const [form,setForm]=useState(vide);

 useEffect(()=>{
  void Promise.all([
   depotBauxDemo.lister(),
   depotLocatairesDemo.lister(),
   depotUnitesDemo.lister(),
   depotImmeublesDemo.lister()
  ]).then(([bauxCharges,locatairesCharges,unitesChargees,immeublesCharges])=>{
   setBaux(bauxCharges);
   setLocataires(locatairesCharges);
   setUnites(unitesChargees);
   setImmeubles(immeublesCharges);
  }).finally(()=>setInitialise(true));
 },[]);
 useEffect(()=>{
  if(!initialise)return;
  void depotBauxDemo.enregistrer(baux).catch(()=>{
   // Le dépôt signale déjà l'indisponibilité du stockage local.
  });
 },[baux,initialise]);

 const nomLocataire=(id:number)=>locataires.find(x=>x.id===id)?.nom??"Locataire introuvable";
 const unite=(id:number)=>unites.find(x=>x.id===id);
 const lieuUnite=(id:number)=>{const u=unite(id);const b=immeubles.find(x=>x.id===u?.immeubleId);return u? `${u.reference} · ${b?.nom??"Immeuble non retrouvé"}`:"Unité introuvable";};
 const filtres=baux.filter(b=>{
  const q=recherche.trim().toLocaleLowerCase("fr");
  const trouve=!q||[b.reference,nomLocataire(b.locataireId),lieuUnite(b.uniteId)].some(x=>x.toLocaleLowerCase("fr").includes(q));
  return trouve&&(filtre==="Tous"||b.statut===filtre)&&(!dateDebut||b.dateDebut>=dateDebut)&&(!dateFin||b.dateDebut<=dateFin);
 });
 const exporterBaux=()=>exporterCsv({
  nomFichier:"cofis-baux-demo.csv",
  entetes:["Référence","Locataire","Unité","Immeuble","Date de début","Date de fin","Loyer mensuel déclaré (FCFA)","Dépôt déclaré (FCFA)","Statut déclaré","Notes"],
  lignes:filtres.map(b=>[b.reference,nomLocataire(b.locataireId),unite(b.uniteId)?.reference??"",immeubles.find(x=>x.id===unite(b.uniteId)?.immeubleId)?.nom??"",b.dateDebut,b.dateFin,b.loyerMensuel,b.depotGarantie,b.statut,b.notes])
 });
 const ouvrirCreation=()=>{setEditionId(null);setForm({...vide,locataireId:locataires[0]?String(locataires[0].id):"",uniteId:unites[0]?String(unites[0].id):""});setModal(true);};
 const ouvrirEdition=(b:Bail)=>{setEditionId(b.id);setForm({reference:b.reference,locataireId:String(b.locataireId),uniteId:String(b.uniteId),dateDebut:b.dateDebut,dateFin:b.dateFin,loyerMensuel:String(b.loyerMensuel),depotGarantie:String(b.depotGarantie),statut:b.statut,notes:b.notes});setModal(true);};
 const enregistrer=(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  const reference=form.reference.trim();
  if(!reference||!form.locataireId||!form.uniteId||!form.dateDebut||!form.dateFin){window.alert("Renseignez la référence, le locataire, l'unité et les deux dates.");return;}
  if(form.dateFin<form.dateDebut){window.alert("La date de fin doit être postérieure ou égale à la date de début.");return;}
  if(!locataires.some(x=>x.id===Number(form.locataireId))||!unites.some(x=>x.id===Number(form.uniteId))){window.alert("Le locataire et l'unité sélectionnés doivent exister dans les registres.");return;}
  if(baux.some(x=>x.id!==editionId&&x.reference.toLocaleLowerCase("fr")===reference.toLocaleLowerCase("fr"))){window.alert("Cette référence de bail est déjà utilisée.");return;}
  const loyer=Number(form.loyerMensuel),depot=Number(form.depotGarantie);
  if(!Number.isSafeInteger(loyer)||loyer<0||!Number.isSafeInteger(depot)||depot<0){window.alert("Les montants doivent être des nombres entiers positifs ou nuls en FCFA.");return;}
  const donnees:Bail={id:editionId??Date.now(),reference,locataireId:Number(form.locataireId),uniteId:Number(form.uniteId),dateDebut:form.dateDebut,dateFin:form.dateFin,loyerMensuel:loyer,depotGarantie:depot,statut:form.statut,notes:form.notes.trim()};
  setBaux(liste=>editionId===null?[donnees,...liste]:liste.map(x=>x.id===editionId?donnees:x));setModal(false);setForm(vide);
 };
 const supprimer=(b:Bail)=>{if(window.confirm(`Supprimer le bail de démonstration ${b.reference} ?`))setBaux(liste=>liste.filter(x=>x.id!==b.id));};
 const couleurs:Record<StatutBail,string>={Brouillon:"bg-amber-50 text-amber-700",Actif:"bg-emerald-50 text-emerald-700",Expiré:"bg-slate-100 text-slate-600",Résilié:"bg-rose-50 text-rose-700"};

 return <CadreApplication><div className="space-y-6">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Espace de travail</span><span>/</span><span>Location</span><span>/</span><span className="font-medium text-slate-600">Baux</span></div><h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestion des baux</h2><p className="mt-1 text-sm text-slate-500">Reliez un locataire à une unité et suivez les principales dates contractuelles.</p></div><button onClick={ouvrirCreation} disabled={!locataires.length||!unites.length} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 hover:bg-blue-700 disabled:opacity-50"><CirclePlus size={17}/> Nouveau bail</button></div>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
   <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs text-slate-500"><span>Total des baux</span><FileText size={19} className="text-blue-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{baux.length}</p><p className="mt-1 text-xs text-slate-400">Dossiers de démonstration</p></article>
   <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs text-slate-500"><span>Baux actifs déclarés</span><FileText size={19} className="text-emerald-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{baux.filter(x=>x.statut==="Actif").length}</p><p className="mt-1 text-xs text-slate-400">Statut saisi manuellement</p></article>
   <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs text-slate-500"><span>Locataires référencés</span><Users size={19} className="text-indigo-600"/></div><p className="mt-4 text-3xl font-bold text-slate-900">{new Set(baux.map(x=>x.locataireId)).size}</p><p className="mt-1 text-xs text-slate-400">Dans les dossiers de bail</p></article>
   <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs text-slate-500"><span>Loyers mensuels contractuels saisis</span><Wallet size={19} className="text-sky-600"/></div><p className="mt-4 text-xl font-bold text-slate-900">{montant(baux.filter(x=>x.statut==="Actif").reduce((s,x)=>s+x.loyerMensuel,0))}</p><p className="mt-1 text-xs text-slate-400">Indication, pas une échéance calculée</p></article>
  </div>
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h3 className="text-sm font-bold text-slate-900">Registre des baux</h3><p className="mt-1 text-xs text-slate-400">{filtres.length} résultat(s)</p></div><FileText size={19} className="text-slate-400"/></div>
   <div className="flex flex-col gap-3 border-b border-slate-100 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={recherche} onChange={e=>setRecherche(e.target.value)} placeholder="Rechercher un bail, locataire, unité..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:bg-white"/></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={exporterBaux} disabled={!initialise||filtres.length===0} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-40"><Download size={14}/> Exporter CSV</button><div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{(["Tous","Brouillon","Actif","Expiré","Résilié"] as const).map(s=><button key={s} type="button" onClick={()=>setFiltre(s)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${filtre===s?"bg-white text-blue-700 shadow-sm":"text-slate-500"}`}>{s}</button>)}</div></div></div><div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-1.5 text-[10px] text-slate-500">Début de période <input type="date" aria-label="Date de début de période" max={dateFin||undefined} value={dateDebut} onChange={e=>setDateDebut(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600"/></label><label className="flex items-center gap-1.5 text-[10px] text-slate-500">Fin de période <input type="date" aria-label="Date de fin de période" min={dateDebut||undefined} value={dateFin} onChange={e=>setDateFin(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600"/></label>{(dateDebut||dateFin)&&<button type="button" onClick={()=>{setDateDebut("");setDateFin("");}} className="h-9 rounded-lg px-2 text-[10px] font-semibold text-blue-700 hover:bg-blue-50">Effacer les dates</button>}</div></div>
   <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead className="bg-slate-50/80"><tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Référence / Locataire</th><th className="px-4 py-3">Unité / Immeuble</th><th className="px-4 py-3">Période</th><th className="px-4 py-3">Loyer mensuel</th><th className="px-4 py-3">Dépôt saisi</th><th className="px-4 py-3">Statut</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
    {filtres.map(b=><tr key={b.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-xs font-semibold text-slate-800">{b.reference}</p><p className="mt-1 text-[11px] text-slate-500">{nomLocataire(b.locataireId)}</p></td><td className="px-4 py-4"><p className="flex items-center gap-1.5 text-xs text-slate-700"><Home size={13} className="text-slate-400"/>{lieuUnite(b.uniteId)}</p></td><td className="px-4 py-4"><p className="flex items-center gap-1.5 text-xs text-slate-700"><CalendarDays size={13} className="text-slate-400"/>{new Date(b.dateDebut+"T00:00:00").toLocaleDateString("fr-FR")} – {new Date(b.dateFin+"T00:00:00").toLocaleDateString("fr-FR")}</p></td><td className="px-4 py-4 text-xs font-semibold text-slate-700">{montant(b.loyerMensuel)}</td><td className="px-4 py-4 text-xs text-slate-600">{montant(b.depotGarantie)}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${couleurs[b.statut]}`}>{b.statut}</span></td><td className="px-5 py-4 text-right"><div className="inline-flex gap-1"><button onClick={()=>ouvrirEdition(b)} aria-label={`Modifier ${b.reference}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"><Pencil size={15}/></button><button onClick={()=>supprimer(b)} aria-label={`Supprimer ${b.reference}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15}/></button></div></td></tr>)}
    {filtres.length===0&&<tr><td colSpan={7} className="px-5 py-14 text-center"><FileText className="mx-auto text-slate-300" size={24}/><p className="mt-3 text-sm font-semibold text-slate-700">Aucun bail trouvé</p><p className="mt-1 text-xs text-slate-400">Modifiez les filtres ou créez un bail de démonstration.</p></td></tr>}
   </tbody></table></div><div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">Données fictives conservées dans le stockage local du navigateur.</div>
  </section>
  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-xs font-semibold text-amber-900">Mode démonstration et règles à valider</p><p className="mt-1 text-[11px] leading-5 text-amber-800">Aucun contrat juridique n'est généré. Les statuts sont déclaratifs : les règles de cycle de vie, de chevauchement des périodes et d'unicité d'un bail actif par unité restent à confirmer. Aucun calendrier d'échéances ni encaissement n'est créé automatiquement. N'utilisez pas de données contractuelles réelles.</p></div>
 </div>
 {modal&&<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false);}}><div role="dialog" aria-modal="true" aria-labelledby="titre-bail" className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
  <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="titre-bail" className="text-base font-bold text-slate-900">{editionId===null?"Créer un bail":"Modifier le bail"}</h3><p className="mt-1 text-xs text-slate-500">Associez un locataire et une unité existants.</p></div><button onClick={()=>setModal(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17}/></button></div>
  <form onSubmit={enregistrer} className="space-y-4 p-5">
   <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="ref-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Référence du bail *</label><input id="ref-bail" required value={form.reference} onChange={e=>setForm({...form,reference:e.target.value})} placeholder="BAIL-2026-003" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div><div><label htmlFor="statut-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Statut déclaré</label><select id="statut-bail" value={form.statut} onChange={e=>setForm({...form,statut:e.target.value as StatutBail})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{(["Brouillon","Actif","Expiré","Résilié"] as const).map(s=><option key={s}>{s}</option>)}</select></div></div>
   <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="locataire-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Locataire *</label><select id="locataire-bail" required value={form.locataireId} onChange={e=>setForm({...form,locataireId:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Sélectionner</option>{locataires.map(l=><option key={l.id} value={l.id}>{l.nom}</option>)}</select></div><div><label htmlFor="unite-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Unité *</label><select id="unite-bail" required value={form.uniteId} onChange={e=>setForm({...form,uniteId:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Sélectionner</option>{unites.map(u=><option key={u.id} value={u.id}>{u.reference} — {immeubles.find(b=>b.id===u.immeubleId)?.nom??"Immeuble"}</option>)}</select></div></div>
   <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="debut-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Date de début *</label><input id="debut-bail" type="date" required value={form.dateDebut} onChange={e=>setForm({...form,dateDebut:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div><div><label htmlFor="fin-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Date de fin *</label><input id="fin-bail" type="date" required min={form.dateDebut||undefined} value={form.dateFin} onChange={e=>setForm({...form,dateFin:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div></div>
   <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="loyer-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Loyer mensuel (FCFA) *</label><input id="loyer-bail" type="number" min="0" step="1" required value={form.loyerMensuel} onChange={e=>setForm({...form,loyerMensuel:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div><div><label htmlFor="depot-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Dépôt de garantie saisi (FCFA)</label><input id="depot-bail" type="number" min="0" step="1" value={form.depotGarantie} onChange={e=>setForm({...form,depotGarantie:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></div></div>
   <div><label htmlFor="notes-bail" className="mb-1.5 block text-xs font-semibold text-slate-700">Notes internes (facultatif)</label><textarea id="notes-bail" rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"/></div>
   <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={()=>setModal(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Annuler</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">Enregistrer le bail</button></div>
  </form>
 </div></div>}
 </CadreApplication>;
}
