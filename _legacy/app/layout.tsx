import type { Metadata } from "next";
import { Crimson_Pro, IM_Fell_DW_Pica } from "next/font/google";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const crimson = Crimson_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const fell = IM_Fell_DW_Pica({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.legeai-informatique.fr"),
  title: {
    default: "Le Geai Informatique · Sites web sur mesure, maintenance | Lyon",
    template: "%s | Le Geai Informatique",
  },
  description: "Le Geai Informatique : sites web sur mesure, maintenance, Microsoft 365, outils numériques. Développeur expert à Lyon, Annecy, Clermont-Ferrand.",
  keywords: [
    "création site web Lyon", "développeur web Lyon", "site internet sur mesure",
    "création site web Annecy", "création site web Clermont-Ferrand",
    "maintenance site web", "Microsoft 365 entreprise Lyon",
    "développeur freelance Lyon", "site vitrine professionnel",
    "site e-commerce Lyon", "accompagnement numérique entreprise",
    "outil sur mesure", "data engineering Lyon", "formation informatique",
    "refonte site internet", "hébergement web Lyon",
    "Le Geai Informatique", "agence web Lyon", "prestataire informatique Lyon"
  ],
  authors: [{ name: "Le Geai Informatique", url: "https://www.legeai-informatique.fr" }],
  creator: "Le Geai Informatique",
  publisher: "Le Geai Informatique",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://www.legeai-informatique.fr",
    languages: { "fr-FR": "https://www.legeai-informatique.fr" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.legeai-informatique.fr",
    siteName: "Le Geai Informatique",
    title: "Le Geai Informatique · Création de site web, maintenance, accompagnement numérique",
    description: "Sites web sur mesure, maintenance durable, Microsoft 365, outils numériques. Développeur expert à Lyon, Annecy, Clermont-Ferrand.",
  },
  twitter: {
    card: "summary",
    title: "Le Geai Informatique · Création de site web sur mesure",
    description: "Sites web, maintenance, Microsoft 365, outils sur mesure. Lyon, Annecy, Clermont-Ferrand.",
  },
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  verification: {},
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${crimson.variable} ${fell.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Aller au contenu</a>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
