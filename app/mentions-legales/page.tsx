import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Mentions légales | Le Geai Informatique",
  description: "Mentions légales du site Le Geai Informatique : éditeur, hébergement, propriété intellectuelle, responsabilité, contact.",
  alternates: { canonical: "https://www.legeai-informatique.fr/mentions-legales" },
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.legal}>
        <Reveal>
          <h1>Mentions légales</h1>
        </Reveal>

        <Reveal delay={0.1}>
          <section>
            <h2>Éditeur du site</h2>
            <p><strong>Le Geai</strong> — Lucas Gaio dos Santos</p>
            <p>31 rue Pasteur, 69007 Lyon</p>
            <p>administration@legeai-editions.com</p>
            <p>+33 4 82 53 25 64</p>
            <p>Directeur de la publication : Lucas Gaio dos Santos</p>
          </section>
        </Reveal>

        <Reveal delay={0.15}>
          <section>
            <h2>Activité présentée sur ce site</h2>
            <p>
              Le présent site présente l'activité de Le Geai Informatique, branche
              de prestations informatiques de Le Geai, comprenant notamment la
              création de sites web, la mise en place d'outils numériques,
              l'accompagnement, le suivi et diverses prestations informatiques.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section>
            <h2>Hébergement</h2>
            <p>Site hébergé sur un VPS OVHcloud.</p>
            <p>
              OVHcloud — 2 rue Kellermann, 59100 Roubaix, France.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.25}>
          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble des textes, éléments visuels, signes distinctifs,
              structures, compositions, logos, contenus et éléments graphiques
              présents sur ce site, sauf mention contraire, relève de Le Geai.
            </p>
            <p>
              Toute reproduction, représentation, adaptation, diffusion ou
              exploitation, totale ou partielle, sans autorisation écrite
              préalable, demeure interdite.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <section>
            <h2>Responsabilité</h2>
            <p>
              Les informations publiées sur ce site sont fournies à titre
              informatif. Elles peuvent évoluer selon les besoins, les contraintes
              techniques, les échanges de cadrage ou les mises à jour de
              l'activité.
            </p>
            <p>
              Le Geai s'efforce d'assurer l'exactitude et la mise à jour des
              informations présentées, sans garantir l'absence totale d'erreur,
              d'omission ou d'indisponibilité ponctuelle.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.35}>
          <section>
            <h2>Contact</h2>
            <p>Pour toute question relative au site ou à son contenu :</p>
            <p>administration@legeai-editions.com</p>
            <p>+33 4 82 53 25 64</p>
          </section>
        </Reveal>
      </article>
      </main>
      <Footer />
    </>
  );
}
