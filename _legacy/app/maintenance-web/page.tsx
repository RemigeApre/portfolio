import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Maintenance et suivi de site web | Dès 39 €/mois | Lyon",
  description: "Maintenance web, hébergement, surveillance, correctifs, évolutions. 4 formules dès 39 €/mois. Le Geai Informatique, Lyon, Annecy, Clermont-Ferrand.",
  alternates: { canonical: "https://www.legeai-informatique.fr/maintenance-web" },
};

export default function MaintenanceWeb() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.service}>
        <Reveal>
          <h1>Maintenance et suivi</h1>
          <p className={s.intro}>
            Un site livré n'est pas un site abandonné. Hébergement,
            surveillance, correctifs, évolutions et accompagnement dans la
            durée.
          </p>
        </Reveal>

        <div className={s.offers}>
          <Reveal delay={0.1}>
            <div className={s.offer}>
              <p className={s.tier}>Socle</p>
              <h2>Essentiel</h2>
              <p className={s.desc}>Hébergement, SSL, surveillance, correctifs critiques.</p>
              <p className={s.price}>39 €<span>/mois</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.13}>
            <div className={s.offer}>
              <p className={s.tier}>Croissance</p>
              <h2>Pro</h2>
              <p className={s.desc}>Sauvegardes, 2h de modifications mensuelles, améliorations proactives.</p>
              <p className={s.price}>149 €<span>/mois</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className={s.offer}>
              <p className={s.tier}>Alliance</p>
              <h2>Premium</h2>
              <p className={s.desc}>4h de développement, intervention sous 24h, formation.</p>
              <p className={s.price}>299 €<span>/mois</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.19}>
            <div className={s.offer}>
              <p className={s.tier}>Excellence</p>
              <h2>Sérénité</h2>
              <p className={s.desc}>Gestion active, ajout de contenu, priorité maximale.</p>
              <p className={s.price}>499 €<span>/mois</span></p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className={s.cta}>
            <p>
              Besoin d'un <Link href="/creation-site-web">site à créer</Link> avant
              d'envisager la maintenance ? Ou directement{" "}
              <Link href="/contact">prendre contact</Link>.
            </p>
            <Link href="/contact" className={s.ctaBtn}>Demander un cadrage</Link>
          </div>
        </Reveal>
      </article>
      </main>
      <Footer />
    </>
  );
}
