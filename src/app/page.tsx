import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Users,
  Wallet
} from "lucide-react";

const navigation = [
  { label: "Vue d'ensemble", icon: LayoutDashboard, active: true },
  { label: "Propriétaires", icon: Users },
  { label: "Immeubles", icon: Building2 },
  { label: "Locataires", icon: Users },
  { label: "Paiements", icon: CreditCard },
  { label: "Dépenses", icon: Wallet },
  { label: "Rapports", icon: ClipboardList }
];

const indicateurs = [
  { label: "Propriétés", valeur: "—", detail: "Enregistrées", icon: Building2 },
  { label: "Locataires", valeur: "—", detail: "Actifs", icon: Users },
  { label: "Loyers encaissés", valeur: "—", detail: "Ce mois · FCFA", icon: CreditCard },
  { label: "Impayés", valeur: "—", detail: "À suivre · FCFA", icon: Wallet }
];

export default function PageAccueil() {
  return (
    <main className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--bordure)] bg-white px-5 py-7 md:flex">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">C</div>
          <div>
            <p className="text-base font-bold tracking-tight">COFIS</p>
            <p className="text-xs text-slate-500">IMMOBILIER</p>
          </div>
        </div>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Espace de gestion</p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${item.active ? "bg-blue-50 text-blue-700" : "text-slate-600"}`}>
                <Icon size={18} strokeWidth={1.8} />
                {item.label}
              </div>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-700">COFIS Immobilier</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Gestion immobilière centralisée</p>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-[var(--bordure)] bg-white px-6 md:px-10">
          <div>
            <p className="text-xs text-slate-500">Espace de travail / Tableau de bord</p>
            <h1 className="mt-1 text-lg font-semibold">Vue d'ensemble</h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">CF</div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-700">Bienvenue sur votre espace</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Votre activité immobilière, en un coup d'œil.</h2>
              <p className="mt-2 text-sm text-slate-500">Les indicateurs apparaîtront ici après la connexion des données.</p>
            </div>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">Environnement de développement</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {indicateurs.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="rounded-2xl border border-[var(--bordure)] bg-white p-5 shadow-sm shadow-slate-200/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={18} /></span>
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{item.valeur}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
            <article className="rounded-2xl border border-[var(--bordure)] bg-white p-6 shadow-sm shadow-slate-200/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Activité locative</h3>
                  <p className="mt-1 text-sm text-slate-500">Suivi des loyers et encaissements</p>
                </div>
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Ce mois</span>
              </div>
              <div className="mt-8 flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70">
                <p className="max-w-xs text-center text-sm text-slate-400">Les données financières seront affichées après la mise en place des modules de gestion.</p>
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--bordure)] bg-white p-6 shadow-sm shadow-slate-200/40">
              <h3 className="font-semibold text-slate-900">À suivre</h3>
              <p className="mt-1 text-sm text-slate-500">Les prochaines actions de gestion</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700"><ArrowUpRight size={16} /></span>
                  <div><p className="text-sm font-medium text-slate-700">Échéances de loyer</p><p className="mt-1 text-xs text-slate-500">À connecter au calendrier locatif</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-amber-50 p-2 text-amber-700"><ArrowDownRight size={16} /></span>
                  <div><p className="text-sm font-medium text-slate-700">Paiements en attente</p><p className="mt-1 text-xs text-slate-500">Suivi des règlements à venir</p></div>
                </div>
              </div>
            </article>
          </div>
          <p className="mt-8 text-center text-xs text-slate-400">COFIS IMMOBILIER · Plateforme de gestion locative</p>
        </div>
      </section>
    </main>
  );
}
