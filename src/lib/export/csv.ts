/**
 * Exporte des lignes tabulaires en CSV compatible avec les tableurs francophones.
 * Les cellules sont protégées contre l'interprétation de formules par Excel/LibreOffice.
 */
type ValeurCsv = string | number | null | undefined;

type OptionsExportCsv = {
  nomFichier: string;
  entetes: string[];
  lignes: ValeurCsv[][];
};

function protegerCellule(valeur: ValeurCsv): string {
  const texte = String(valeur ?? "");
  const securise = /^[\s]*[=+@-]/.test(texte) ? "'" + texte : texte;
  return '"' + securise.replaceAll('"', '""') + '"';
}

export function exporterCsv({ nomFichier, entetes, lignes }: OptionsExportCsv): void {
  const contenu = "\uFEFF" + [entetes, ...lignes]
    .map((ligne) => ligne.map(protegerCellule).join(";"))
    .join("\r\n");
  const fichier = new Blob([contenu], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(fichier);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nomFichier;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(url);
}
