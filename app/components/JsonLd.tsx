export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": "https://www.legeai-informatique.fr/#organization",
        name: "Le Geai Informatique",
        alternateName: ["Le Geai Info", "Legeai Informatique"],
        url: "https://www.legeai-informatique.fr",
        description: "Création de sites web sur mesure, maintenance, Microsoft 365, outils numériques, accompagnement durable. Développeur expert à Lyon, Annecy, Clermont-Ferrand.",
        telephone: "+33482532564",
        email: "administration@legeai-editions.com",
        foundingDate: "2025",
        address: {
          "@type": "PostalAddress",
          streetAddress: "31 rue Pasteur",
          addressLocality: "Lyon",
          postalCode: "69007",
          addressRegion: "Auvergne-Rhône-Alpes",
          addressCountry: "FR",
        },
        geo: { "@type": "GeoCoordinates", latitude: 45.764043, longitude: 4.835659 },
        areaServed: [
          { "@type": "City", name: "Lyon" },
          { "@type": "City", name: "Villeurbanne" },
          { "@type": "City", name: "Vénissieux" },
          { "@type": "City", name: "Caluire-et-Cuire" },
          { "@type": "City", name: "Bron" },
          { "@type": "City", name: "Vaulx-en-Velin" },
          { "@type": "City", name: "Saint-Étienne" },
          { "@type": "City", name: "Annecy" },
          { "@type": "City", name: "Annemasse" },
          { "@type": "City", name: "Chambéry" },
          { "@type": "City", name: "Clermont-Ferrand" },
          { "@type": "City", name: "Grenoble" },
          { "@type": "City", name: "Valence" },
          { "@type": "AdministrativeArea", name: "Auvergne-Rhône-Alpes" },
          { "@type": "Country", name: "France" },
        ],
        serviceType: [
          "Création de sites web",
          "Création de site vitrine",
          "Création de site e-commerce",
          "Développement web sur mesure",
          "Gestion Microsoft 365",
          "Maintenance web",
          "Hébergement web",
          "Data Engineering",
          "Formation informatique",
          "Référencement SEO",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services Le Geai Informatique",
          itemListElement: [
            { "@type": "Offer", name: "Site de présentation", price: "800", priceCurrency: "EUR", priceValidUntil: "2027-12-31", availability: "https://schema.org/InStock" },
            { "@type": "Offer", name: "Site avec espace de gestion", price: "2500", priceCurrency: "EUR", priceValidUntil: "2027-12-31", availability: "https://schema.org/InStock" },
            { "@type": "Offer", name: "Boutique en ligne", price: "6000", priceCurrency: "EUR", priceValidUntil: "2027-12-31", availability: "https://schema.org/InStock" },
            { "@type": "Offer", name: "Maintenance et suivi", price: "39", priceCurrency: "EUR", priceValidUntil: "2027-12-31", availability: "https://schema.org/InStock", priceSpecification: { "@type": "UnitPriceSpecification", unitCode: "MON" } },
            { "@type": "Offer", name: "Microsoft 365", price: "29", priceCurrency: "EUR", priceValidUntil: "2027-12-31", availability: "https://schema.org/InStock", priceSpecification: { "@type": "UnitPriceSpecification", unitCode: "MON" } },
          ],
        },
        priceRange: "€-€€€",
        paymentAccepted: "Virement bancaire",
        currenciesAccepted: "EUR",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        knowsLanguage: ["fr", "en"],
        slogan: "Des outils numériques pensés pour votre activité",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.legeai-informatique.fr/#website",
        url: "https://www.legeai-informatique.fr",
        name: "Le Geai Informatique",
        publisher: { "@id": "https://www.legeai-informatique.fr/#organization" },
        inLanguage: "fr-FR",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Travaillez-vous avec de petites structures ?",
            acceptedAnswer: { "@type": "Answer", text: "Oui. Le Geai Informatique s'adresse aux activités qui cherchent un cadre propre, utile et durable, sans lourdeur inutile." },
          },
          {
            "@type": "Question",
            name: "Reprenez-vous un site ou des outils déjà en place ?",
            acceptedAnswer: { "@type": "Answer", text: "Oui, selon l'état de l'existant. Un échange permet de distinguer ce qui mérite d'être conservé, corrigé ou reconstruit." },
          },
          {
            "@type": "Question",
            name: "Assurez-vous un suivi après la mise en place ?",
            acceptedAnswer: { "@type": "Answer", text: "Oui. Le suivi peut rester ponctuel ou s'inscrire dans la durée, avec maintenance, accompagnement et continuité." },
          },
          {
            "@type": "Question",
            name: "Combien coûte la création d'un site web ?",
            acceptedAnswer: { "@type": "Answer", text: "Un site de présentation commence à 800 €, un site avec espace de gestion à 2 500 €, une boutique en ligne à 6 000 €. Chaque projet est cadré selon le besoin réel." },
          },
          {
            "@type": "Question",
            name: "Comment se passe un premier cadrage ?",
            acceptedAnswer: { "@type": "Answer", text: "Le premier échange sert à comprendre l'activité, les usages, les irritants et les contraintes. Un cadre juste est ensuite proposé." },
          },
          {
            "@type": "Question",
            name: "Peut-on ajuster le périmètre ou le rythme selon la situation ?",
            acceptedAnswer: { "@type": "Answer", text: "Oui. Certaines situations demandent un cadre plus souple, un phasage, un échelonnement ou une progression plus mesurée." },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
