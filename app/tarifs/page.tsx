import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Tarifs | Le Geai Informatique",
  description: "Tarifs clairs pour la création de site, la maintenance, Microsoft 365 et le développement sur mesure. Lyon, Annecy, Clermont-Ferrand.",
};

export default function Tarifs() {
  return (
    <>
      <Nav />
      <section className={s.hero}>
        <Reveal>
          <p className="label">Tarifs</p>
          <h1 className="section-title">Des tarifs clairs, pensés pour un travail réel</h1>
          <p className="section-sub" style={{ margin: "1.2rem auto 0", textAlign: "center" }}>
            Un tarif cohérent rémunère une compréhension du besoin, une mise en place propre et une continuité dans le temps.
          </p>
        </Reveal>
      </section>

      <section className={s.grid}>
        <Reveal>
          <div className={s.category}>
            <h2>Création web</h2>
            <div className={s.cards}>
              <div className={s.card}>
                <p className={s.tier}>Essentiel</p>
                <h3>Site de présentation</h3>
                <p className={s.desc}>2 à 5 pages. Votre activité présentée avec clarté, adaptée à tous les écrans.</p>
                <p className={s.price}>800 € <span>/ projet</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Avancé</p>
                <h3>Site de gestion</h3>
                <p className={s.desc}>Administration, base de données, gestion de contenu. Formation incluse.</p>
                <p className={s.price}>2 500 € <span>/ projet</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Sur mesure</p>
                <h3>Boutique en ligne</h3>
                <p className={s.desc}>Catalogue, paiement sécurisé, gestion des commandes.</p>
                <p className={s.price}>6 000 € <span>/ projet</span></p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className={s.category}>
            <h2>Maintenance et suivi</h2>
            <div className={s.cards}>
              <div className={s.card}>
                <p className={s.tier}>Socle</p>
                <h3>Essentiel</h3>
                <p className={s.desc}>Hébergement, SSL, surveillance, correctifs critiques.</p>
                <p className={s.price}>39 € <span>/ mois</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Croissance</p>
                <h3>Pro</h3>
                <p className={s.desc}>Sauvegardes, 2h de modifications mensuelles, améliorations proactives.</p>
                <p className={s.price}>149 € <span>/ mois</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Alliance</p>
                <h3>Premium</h3>
                <p className={s.desc}>4h de développement, intervention sous 24h, formation.</p>
                <p className={s.price}>299 € <span>/ mois</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Excellence</p>
                <h3>Sérénité</h3>
                <p className={s.desc}>Gestion active, ajout de contenu, priorité maximale.</p>
                <p className={s.price}>499 € <span>/ mois</span></p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className={s.category}>
            <h2>Microsoft 365</h2>
            <div className={s.cards}>
              <div className={s.card}>
                <p className={s.tier}>Mise en place</p>
                <h3>Basique</h3>
                <p className={s.desc}>Domaine, profils, Teams, SharePoint. Licences incluses.</p>
                <p className={s.price}>29 € <span>/ util. / mois</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Accompagnement</p>
                <h3>Complet</h3>
                <p className={s.desc}>Formation, boîtes mail partagées, support sous 48h. Licences incluses.</p>
                <p className={s.price}>49 € <span>/ util. / mois</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Assistance</p>
                <h3>Support</h3>
                <p className={s.desc}>Support dédié sous 48h, jusqu'à 10 incidents par mois.</p>
                <p className={s.price}>100 € <span>/ 5 util. / mois</span></p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className={s.category}>
            <h2>Expertise</h2>
            <div className={s.cards}>
              <div className={s.card}>
                <p className={s.tier}>Data</p>
                <h3>Data Engineering</h3>
                <p className={s.desc}>Pipelines, intégration, transformation et mise en qualité.</p>
                <p className={s.price}>600 € <span>/ jour</span></p>
              </div>
              <div className={s.card}>
                <p className={s.tier}>Transmission</p>
                <h3>Formation</h3>
                <p className={s.desc}>Formation professionnelle ou académique, développement, outils.</p>
                <p className={s.price}>400 € <span>/ jour</span></p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={s.cta}>
        <Reveal>
          <p>Chaque besoin ne demande pas la même réponse. Un échange permet de cadrer simplement ce qui est pertinent.</p>
          <Link href="/contact" className="btn-primary">Demander un cadrage <span>→</span></Link>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
