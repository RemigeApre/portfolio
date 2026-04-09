import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Création de site web sur mesure | Lyon, Annecy, Clermont-Ferrand",
  description: "Création de site vitrine, site de gestion et boutique en ligne. Code sur mesure, sans template. Dès 800 €. Le Geai Informatique, Lyon.",
  alternates: { canonical: "https://www.legeai-informatique.fr/creation-site-web" },
};

export default function CreationSiteWeb() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.service}>
        <Reveal>
          <h1>Création de site web sur mesure</h1>
          <p className={s.intro}>
            Chaque site est construit à partir de votre activité réelle. Code
            sur mesure, sans template, sans WordPress. Vous êtes propriétaire
            de tout.
          </p>
        </Reveal>

        <div className={s.offers}>
          <Reveal delay={0.1}>
            <div className={s.offer}>
              <p className={s.tier}>Essentiel</p>
              <h2>Site de présentation</h2>
              <p className={s.desc}>
                2 à 5 pages. Votre activité présentée avec clarté, adaptée à
                tous les écrans. Référencement naturel, rapidité, lisibilité.
              </p>
              <p className={s.price}>dès 800 €</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={s.offer}>
              <p className={s.tier}>Avancé</p>
              <h2>Site avec espace de gestion</h2>
              <p className={s.desc}>
                Administration, base de données, gestion de contenu. Formation
                à l'utilisation incluse.
              </p>
              <p className={s.price}>dès 2 500 €</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={s.offer}>
              <p className={s.tier}>Sur mesure</p>
              <h2>Boutique en ligne</h2>
              <p className={s.desc}>
                Catalogue, paiement sécurisé, gestion des commandes. Un outil
                de vente complet, pensé pour votre commerce.
              </p>
              <p className={s.price}>dès 6 000 €</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <section className={s.details}>
            <h2>Ce qui distingue notre approche</h2>
            <div className={s.points}>
              <div>
                <h3>Code propre, pas de template</h3>
                <p>Chaque ligne est écrite pour votre projet. Pas de modèle recyclé, pas de constructeur de page.</p>
              </div>
              <div>
                <h3>Propriété totale</h3>
                <p>Le code vous appartient. Si vous changez de prestataire, vous repartez avec un projet propre et documenté.</p>
              </div>
              <div>
                <h3>Suivi après livraison</h3>
                <p>La mise en ligne n'est pas une fin. <Link href="/maintenance-web">Maintenance et suivi</Link> disponibles dans la durée.</p>
              </div>
              <div>
                <h3>Pensé pour votre métier</h3>
                <p>L'outil s'accorde à vos usages, vos clients, vos contraintes. Pas l'inverse.</p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <div className={s.cta}>
            <p>
              Chaque activité appelle son propre cadre.{" "}
              <Link href="/faq">Consultez les questions fréquentes</Link> ou{" "}
              <Link href="/tarifs">les repères tarifaires</Link>.
            </p>
            <Link href="/contact" className={s.ctaBtn}>
              Demander un cadrage
            </Link>
          </div>
        </Reveal>
      </article>
      </main>
      <Footer />
    </>
  );
}
