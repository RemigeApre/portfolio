import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.legeai-informatique.fr";
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/creation-site-web`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/maintenance-web`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/microsoft-365`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/logiciel-sur-mesure`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/data-engineering`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/tarifs`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
