import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Logiciel sur mesure et automatisation | Lyon, Annecy",
  description: "Développement de logiciels de bureau, scripts, automatisation, tableaux de bord. Solutions sur mesure adaptées à votre activité. Le Geai Informatique.",
  alternates: { canonical: "https://www.legeai-informatique.fr/logiciel-sur-mesure" },
};

export default function LogicielSurMesure() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.service}>
        <Reveal>
          <h1>Logiciel sur mesure et automatisation</h1>
          <p className={s.intro}>
            Quand aucun outil existant ne convient, un développement ciblé peut
            simplifier un usage, automatiser une tâche ou structurer un suivi.
          </p>
        </Reveal>

        <div className={s.offers}>
          <Reveal delay={0.1}>
            <div className={s.offer}>
              <p className={s.tier}>Application</p>
              <h2>Logiciel de bureau</h2>
              <p className={s.desc}>
                Gestion, suivi, organisation. Installé sur vos postes, conçu
                pour votre quotidien.
              </p>
              <p className={s.price}>sur devis</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={s.offer}>
              <p className={s.tier}>Automatisation</p>
              <h2>Scripts et tableaux de bord</h2>
              <p className={s.desc}>
                Rapports automatiques, alertes, traitement de données. Vos
                tâches répétitives deviennent des processus fiables.
              </p>
              <p className={s.price}>sur devis</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className={s.cta}>
            <p>
              Un besoin précis ? <Link href="/faq">Consultez la FAQ</Link> ou{" "}
              <Link href="/contact">décrivez votre besoin</Link>.
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
