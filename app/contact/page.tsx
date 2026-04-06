import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Contact | Le Geai Informatique",
  description: "Contactez Le Geai Informatique. Basé à Lyon, disponible à Annecy, Clermont-Ferrand et partout en France. Réponse sous 48h ouvrées.",
};

export default function Contact() {
  return (
    <>
      <Nav />
      <section className={s.hero}>
        <Reveal>
          <p className="label">Contact</p>
          <h1 className="section-title">
            Parlons de ce qui peut améliorer votre activité
          </h1>
          <p className="section-sub" style={{ margin: "1.2rem auto 0", textAlign: "center" }}>
            Décrivez la situation, les contraintes ou le projet. Nous reviendrons avec une recommandation claire.
          </p>
        </Reveal>
      </section>

      <section className={s.options}>
        <div className={s.optionsInner}>
          <Reveal delay={0.1}>
            <div className={s.option}>
              <h2>Échange rapide</h2>
              <p>Une question, un besoin simple, une première prise de contact.</p>
              <a href="mailto:administration@legeai-editions.com" className={s.data}>
                administration@legeai-editions.com
              </a>
              <a href="tel:+33482532564" className={s.data}>
                +33 4 82 53 25 64
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={s.option}>
              <h2>Cadrage structuré</h2>
              <p>
                Décrivez votre activité, vos outils actuels et ce qui pose
                problème. Nous analyserons la situation et proposerons une
                recommandation claire, adaptée et exploitable.
              </p>
              <a href="mailto:administration@legeai-editions.com?subject=Cadrage%20structur%C3%A9" className="btn-primary" style={{ marginTop: "1rem" }}>
                Décrire votre besoin <span>→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={s.details}>
        <Reveal>
          <div className={s.detailsInner}>
            <div className={s.detailBlock}>
              <h3>Réponse</h3>
              <p>Sous 48h ouvrées</p>
            </div>
            <div className={s.detailBlock}>
              <h3>Siège</h3>
              <p>Lyon, Auvergne-Rhône-Alpes</p>
            </div>
            <div className={s.detailBlock}>
              <h3>Disponibilité</h3>
              <p>Lyon · Annecy · Clermont-Ferrand · Partout en France</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
