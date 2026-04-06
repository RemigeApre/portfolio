import type { Metadata } from "next";
import { Crimson_Pro, IM_Fell_DW_Pica } from "next/font/google";
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
  title: "Le Geai Informatique · Outils numériques pensés pour votre activité",
  description:
    "Le Geai Informatique conçoit, met en place et accompagne des dispositifs numériques pensés à partir du réel. Lyon, Annecy, Clermont-Ferrand.",
  metadataBase: new URL("https://www.legeai-informatique.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Le Geai Informatique",
  },
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${crimson.variable} ${fell.variable}`}>
      <body>{children}</body>
    </html>
  );
}
