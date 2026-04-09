import Link from "next/link";
import Nav from "./components/Nav";
import HeroScene from "./components/HeroScene";
import FriezeLine from "./components/FriezeLine";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import s from "./page.module.css";

export default function Home() {
  return (
    <>
      <Nav />
      <HeroScene />

      {/* ═══ MOUVEMENT 2 · SERVIR DANS LA DURÉE ═══ */}
      <section className={s.serve}>
        <div className={s.serveInner}>
          <Reveal>
            <h2 className="section-title">Servir votre activité dans la durée</h2>
            <p className={s.serveIntro}>
              Chaque intervention respecte la réalité de vos clients, de vos
              équipes et de vos partenaires. Elle s'accorde à vos usages, à vos
              contraintes et à votre rythme. Notre travail suit quatre lignes
              simples : clarifier, alléger, relier, prolonger.
            </p>
          </Reveal>

          <div className={s.serveGrid}>
            <Reveal delay={0.1}>
              <div className={s.serveCard}>
                <h3>Sur mesure pour votre activité</h3>
                <p>
                  Des outils et des accompagnements taillés pour votre réalité.
                  Chaque solution s'accorde à vos usages, à vos équipes, à vos
                  clients, à vos partenaires et à la trajectoire propre de votre
                  activité.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className={s.serveCard}>
                <h3>Suivi durable</h3>
                <p>
                  Chaque intervention laisse derrière elle une transmission
                  claire, une disponibilité raisonnable et un accompagnement
                  ponctuel dans la mesure du possible. Pour ceux qui le
                  souhaitent, ce socle peut se prolonger par un suivi durable et
                  un véritable partenariat dans le temps.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={s.serveCard}>
                <h3>Simplicité d'usage réelle</h3>
                <p>
                  Nos équipes rassemblent des profils choisis pour leur
                  précision, leur intelligence du terrain et leur clarté
                  d'expression. Les solutions gagnent ainsi en lisibilité, en
                  simplicité et en fluidité, tandis que la complexité reste à
                  distance de vos usages quotidiens.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className={s.serveCard}>
                <h3>Une ligne d'échange claire</h3>
                <p>
                  Plusieurs canaux de discussion apportent la souplesse
                  nécessaire. Une chaîne courte affine la compréhension, resserre
                  les décisions et soutient une continuité plus ferme.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <aside className={s.serveAside}>
              <h3>Une attention portée au réel</h3>
              <p>
                Les périodes tendues existent. Nous le savons. Selon le besoin,
                le périmètre peut s'ajuster, les paiements peuvent
                s'échelonner, et certaines formules récurrentes peuvent respirer
                pendant un temps. Une relation durable réclame aussi cette
                intelligence des circonstances.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* ═══ MOUVEMENT 3 · PREUVES ═══ */}
      <section className={s.works}>
        <div className={s.worksInner}>
          <Reveal>
            <h2 className="section-title">Trois réalisations, trois usages réels</h2>
            <p className={s.worksIntro}>
              Trois cadres différents, une même exigence : rendre un usage plus
              clair, plus fluide, plus durable.
            </p>
          </Reveal>

          <div className={s.worksGrid}>
            <Reveal delay={0.1}>
              <article className={`${s.workCard} ${s.workBergfrid}`}>
                <p className={s.workSub}>Plateforme éditoriale</p>
                <h3>Bergfrid</h3>
                <p className={s.workBody}>
                  Architecture de publication, hiérarchie de l'information,
                  circulation entre les contenus, logique de durée.
                </p>
                <Link
                  href="https://bergfrid.com"
                  target="_blank"
                  rel="noopener"
                  className={s.workLink}
                >
                  Visiter le projet
                </Link>
              </article>
            </Reveal>

            <Reveal delay={0.2}>
              <article className={`${s.workCard} ${s.workGaio}`}>
                <p className={s.workSub}>Commerce de terrain</p>
                <h3>Gaio Polart</h3>
                <p className={s.workBody}>
                  Présence commerciale, usages quotidiens, données,
                  listes partagées, logique d'évolution.
                </p>
                <Link
                  href="https://gaio-polart.legeai-informatique.fr/"
                  target="_blank"
                  rel="noopener"
                  className={s.workLink}
                >
                  Visiter le projet
                </Link>
              </article>
            </Reveal>

            <Reveal delay={0.3}>
              <article className={`${s.workCard} ${s.workSelf}`}>
                <p className={s.workSub}>Vitrine haut de gamme</p>
                <h3>Le Geai Informatique</h3>
                <p className={s.workBody}>
                  Hiérarchie, matière, rythme, lisibilité, contact :
                  démonstration appliquée à notre propre maison.
                </p>
                <span className={s.workHere}>Vous y êtes</span>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <div className={s.divider}>
        <div className={s.dividerLine} />
      </div>

      {/* ═══ MOUVEMENT 4 · MÉTHODE ═══ */}
      <section className={s.method}>
        <Reveal>
          <h2 className={s.methodTitle}>Une méthode</h2>
        </Reveal>

        <div className={s.frieze}>
          <FriezeLine />

          <div className={s.friezeSteps}>
            <Reveal delay={0.1}>
              <div className={s.friezeStep}>
                <span className={s.friezeNum}>1</span>
                <h3>Écouter</h3>
                <p>Usages, contraintes, irritants, rythme, besoins réels.</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className={s.friezeStep}>
                <span className={s.friezeNum}>2</span>
                <h3>Cadrer</h3>
                <p>La bonne réponse, à la bonne échelle, pour le bon usage.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={s.friezeStep}>
                <span className={s.friezeNum}>3</span>
                <h3>Construire</h3>
                <p>Un outil lisible, fiable, exploitable, prêt à durer.</p>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className={s.friezeStep}>
                <span className={s.friezeNum}>4</span>
                <h3>Soutenir</h3>
                <p>Transmission, suivi, ajustements, continuité.</p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.35}>
          <div className={s.methodExit}>
            <div className={s.methodExitBar} aria-hidden="true" />
            <Link href="/contact" className={s.methodExitLink}>
              Initier l'échange
            </Link>
            <p>
              Décrivez votre situation ou laissez une adresse pour être
              recontacté au bon moment.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══ MOUVEMENT 5B · TARIFS ═══ */}
      <section className={s.pricing}>
        <div className={s.pricingInner}>
          <Reveal>
            <h2 className="section-title">Des repères tarifaires</h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              Derrière chaque dossier, il y a une écoute réelle, un cadre
              juste, une mise en place soignée et un interlocuteur disponible
              dans le temps.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={s.pricingTable}>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Site de présentation</span>
                <span className={s.pricingValue}>dès 800 €</span>
              </div>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Site avec espace de gestion</span>
                <span className={s.pricingValue}>dès 2 500 €</span>
              </div>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Boutique en ligne</span>
                <span className={s.pricingValue}>dès 6 000 €</span>
              </div>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Maintenance et suivi</span>
                <span className={s.pricingValue}>dès 39 €/mois</span>
              </div>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>
                  Microsoft 365
                </span>
                <span className={s.pricingValue}>dès 29 €/util./mois</span>
              </div>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Outil sur mesure</span>
                <span className={s.pricingValue}>sur devis</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p className={s.pricingNote}>
              Chaque activité appelle son propre cadre. Un échange permet
              d'ajuster la réponse, le rythme et le niveau d'accompagnement.
            </p>
            <div className={s.pricingCta}>
              <Link href="/contact" className="btn-ghost">
                Demander un cadrage
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className={s.divider}>
        <div className={s.dividerLine} />
      </div>

      {/* ═══ MOUVEMENT 6 · ENTRÉE EN RELATION ═══ */}
      <section className={s.contact}>
        <div className={s.contactInner}>
          <Reveal>
            <h2 className="section-title">
              Parlons de votre activité
            </h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              Le bon outil répond à un besoin réel, s'intègre juste et tient
              dans le temps.
            </p>
          </Reveal>
          <div className={s.contactOptions}>
            <Reveal delay={0.1}>
              <div className={s.contactOption}>
                <h3>Premier contact</h3>
                <p>
                  Une question directe, un besoin simple, un premier échange.
                </p>
                <a
                  href="mailto:administration@legeai-editions.com"
                  className={s.contactData}
                >
                  administration@legeai-editions.com
                </a>
                <a href="tel:+33482532564" className={s.contactData}>
                  +33 4 82 53 25 64
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={s.contactOption}>
                <h3>Cadrage structuré</h3>
                <p>
                  Décrivez votre activité, les outils déjà en place et les
                  points à reprendre. Nous reviendrons avec un cadrage clair.
                </p>
                <Link href="/contact" className="btn-primary">
                  Décrire le besoin
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <p className={s.contactBottom}>
              Réponse sous 48h ouvrées. Basé à Lyon. Disponible à Lyon, Annecy,
              Clermont-Ferrand et partout en France.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
