import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Data Engineering et formation informatique | Lyon",
  description: "Data engineering : pipelines, intégration, transformation. Formation professionnelle en informatique. Expert à Lyon, Annecy, Clermont-Ferrand.",
  alternates: { canonical: "https://www.legeai-informatique.fr/data-engineering" },
};

export default function DataEngineering() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.service}>
        <Reveal>
          <h1>Data Engineering et formation</h1>
          <p className={s.intro}>
            Pipelines de données, intégration, transformation, mise en qualité.
            Formation professionnelle ou académique en développement et outils
            numériques.
          </p>
        </Reveal>

        <div className={s.offers}>
          <Reveal delay={0.1}>
            <div className={s.offer}>
              <p className={s.tier}>Expertise</p>
              <h2>Data Engineering</h2>
              <p className={s.desc}>
                Pipelines, intégration, transformation et mise en qualité des
                données. Intervention ponctuelle ou mission structurée.
              </p>
              <p className={s.price}>600 €<span>/jour</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={s.offer}>
              <p className={s.tier}>Transmission</p>
              <h2>Formation</h2>
              <p className={s.desc}>
                Formation professionnelle ou académique : développement, outils
                numériques, méthodologie, bonnes pratiques.
              </p>
              <p className={s.price}>400 €<span>/jour</span></p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className={s.cta}>
            <p>
              <Link href="/tarifs">Voir tous les repères tarifaires</Link> ou{" "}
              <Link href="/contact">décrire votre besoin</Link>.
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
