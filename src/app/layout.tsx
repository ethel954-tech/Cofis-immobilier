import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "COFIS Immobilier",
    template: "%s | COFIS Immobilier"
  },
  description: "Plateforme de gestion immobilière et locative de COFIS."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
