/**
 * Initialise un jeu de données fictives cohérent pour la présentation COFIS.
 * Les données déjà présentes dans le navigateur ne sont jamais écrasées.
 */
type DonneesDemo = {
  cle: string;
  valeurs: unknown[];
};

const jeuxDemo: DonneesDemo[] = [
  {
    cle: "cofis_demo_proprietaires_v1",
    valeurs: [
      { id: 1, nom: "Exemple — Jean Mbarga", type: "Particulier", telephone: "+237 6 90 00 00 01", email: "jean.exemple@cofis.cm", ville: "Yaoundé", biens: 3 },
      { id: 2, nom: "Exemple — Société Immobilière", type: "Société", telephone: "+237 6 90 00 00 02", email: "contact.exemple@cofis.cm", ville: "Douala", biens: 8 },
      { id: 3, nom: "Exemple — Marie Nguemo", type: "Particulier", telephone: "+237 6 90 00 00 03", email: "marie.exemple@cofis.cm", ville: "Bafoussam", biens: 1 }
    ]
  },
  {
    cle: "cofis_demo_immeubles_v1",
    valeurs: [
      { id: 101, nom: "Résidence Les Manguiers", type: "Résidentiel", adresse: "Quartier Bastos", ville: "Yaoundé", proprietaireId: 1, nombreUnites: 12, statut: "Actif" },
      { id: 102, nom: "Immeuble Bonapriso", type: "Mixte", adresse: "Rue Koloko, Bonapriso", ville: "Douala", proprietaireId: 2, nombreUnites: 8, statut: "Actif" },
      { id: 103, nom: "Centre commercial Étoile", type: "Commercial", adresse: "Avenue Kennedy", ville: "Yaoundé", proprietaireId: 2, nombreUnites: 15, statut: "Actif" }
    ]
  },
  {
    cle: "cofis_demo_unites_v1",
    valeurs: [
      { id: 201, reference: "LM-A01", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 85, loyerMensuel: 175000, statut: "Occupée" },
      { id: 202, reference: "LM-A02", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 72, loyerMensuel: 150000, statut: "Disponible" },
      { id: 203, reference: "LM-S01", immeubleId: 101, type: "Studio", etage: "Rez-de-chaussée", surface: 38, loyerMensuel: 85000, statut: "En maintenance" },
      { id: 204, reference: "IB-B03", immeubleId: 102, type: "Bureau", etage: "3e étage", surface: 110, loyerMensuel: 300000, statut: "Occupée" },
      { id: 205, reference: "CE-B01", immeubleId: 103, type: "Boutique", etage: "Rez-de-chaussée", surface: 45, loyerMensuel: 225000, statut: "Disponible" }
    ]
  },
  {
    cle: "cofis_demo_locataires_v1",
    valeurs: [
      { id: 301, nom: "Exemple — Alice Tchoumi", type: "Particulier", telephone: "+237 6 70 00 00 11", email: "alice.exemple@cofis.cm", ville: "Yaoundé", statut: "Actif" },
      { id: 302, nom: "Exemple — Cabinet Horizon", type: "Entreprise", telephone: "+237 6 90 00 00 22", email: "contact.horizon@cofis.cm", ville: "Douala", statut: "Prospect" },
      { id: 303, nom: "Exemple — Paul Ndom", type: "Particulier", telephone: "+237 6 80 00 00 33", email: "paul.exemple@cofis.cm", ville: "Bafoussam", statut: "Inactif" }
    ]
  },
  {
    cle: "cofis_demo_baux_v1",
    valeurs: [
      { id: 401, reference: "BAIL-2026-001", locataireId: 301, uniteId: 201, dateDebut: "2026-01-01", dateFin: "2026-12-31", loyerMensuel: 175000, depotGarantie: 350000, statut: "Actif", notes: "Exemple fictif — bail résidentiel." },
      { id: 402, reference: "BAIL-2026-002", locataireId: 302, uniteId: 205, dateDebut: "2026-03-01", dateFin: "2027-02-28", loyerMensuel: 225000, depotGarantie: 450000, statut: "Brouillon", notes: "Exemple fictif — dossier à finaliser." }
    ]
  },
  {
    cle: "cofis_demo_paiements_v1",
    valeurs: [
      { id: 501, reference: "PAY-DEMO-001", bailId: 401, datePaiement: "2026-11-05", montant: 175000, mode: "Virement bancaire", referenceExterne: "VIR-DEMO-0511", observation: "Exemple fictif de paiement enregistré." },
      { id: 502, reference: "PAY-DEMO-002", bailId: 401, datePaiement: "2026-10-05", montant: 100000, mode: "Mobile Money", referenceExterne: "", observation: "Exemple fictif — aucun rapprochement effectué." }
    ]
  },
  {
    cle: "cofis_demo_depenses_v1",
    valeurs: [
      { id: 601, reference: "DEP-DEMO-001", dateDepense: "2026-11-03", categorie: "Entretien", description: "Réparation d'une fuite — exemple fictif", fournisseur: "Plomberie Exemple", montant: 45000, referenceJustificatif: "FACT-DEMO-03" },
      { id: 602, reference: "DEP-DEMO-002", dateDepense: "2026-11-08", categorie: "Nettoyage", description: "Nettoyage des parties communes — exemple fictif", fournisseur: "Services Propreté", montant: 25000, referenceJustificatif: "" }
    ]
  }
];

export function initialiserDonneesDemo(): number {
  let nombreInitialise = 0;

  for (const jeu of jeuxDemo) {
    try {
      if (window.localStorage.getItem(jeu.cle) === null) {
        window.localStorage.setItem(jeu.cle, JSON.stringify(jeu.valeurs));
        nombreInitialise += 1;
      }
    } catch {
      // Le navigateur peut bloquer le stockage local ; les modules gardent leurs exemples intégrés.
    }
  }

  return nombreInitialise;
}
