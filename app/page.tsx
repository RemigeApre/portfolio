import Link from "next/link";
import Nav from "./components/Nav";
import HeroScene from "./components/HeroScene";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import s from "./page.module.css";

export default function Home() {
  return (
    <>
      <Nav />
      <HeroScene />

      {/* ═══ MOUVEMENT 2 · LE MONDE FATIGUÉ ═══ */}
      <section className={s.fatigue}>
        <div className={s.fatigueInner}>
          <Reveal>
            <h2 className="section-title">Ce que beaucoup ont déjà vécu</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={s.fatigueText}>
              Le numérique professionnel a souvent été vendu comme une promesse
              simple. La réalité est souvent différente.
            </p>
          </Reveal>
        </div>
        <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
          <Reveal delay={0.25}>
            <div className={s.fatigueItems}>
              <div className={s.fatigueItem}>
                <h3>Un site présent, mais peu utile</h3>
                <p>
                  Une présence en ligne qui n'aide ni les clients à comprendre
                  l'activité, ni l'entreprise à mieux recevoir les demandes.
                </p>
              </div>
              <div className={s.fatigueItem}>
                <h3>Des solutions génériques</h3>
                <p>
                  Un modèle à peine ajusté, sans logique métier, sans réflexion
                  d'usage, sans continuité.
                </p>
              </div>
              <div className={s.fatigueItem}>
                <h3>Des outils qui alourdissent</h3>
                <p>
                  Au lieu d'alléger le quotidien, certains dispositifs deviennent
                  une source de confusion pour le dirigeant et les équipes.
                </p>
              </div>
              <div className={s.fatigueItem}>
                <h3>Une mise en place sans suite</h3>
                <p>
                  L'outil est livré, puis il reste seul. Les questions
                  s'accumulent, les usages stagnent, personne ne reprend la main.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className={s.divider}>
        <div className={s.dividerLine} />
      </div>

      {/* ═══ MOUVEMENT 3 · LA BASCULE ═══ */}
      <section className={s.shift} id="approche">
        <div className={s.shiftInner}>
          <Reveal>
            <h2 className="section-title">
              Ce que Le Geai Informatique apporte
            </h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              Un outil utile répond à une réalité de terrain, reste
              compréhensible et allège le quotidien.
            </p>
          </Reveal>
          <div className={s.shiftGrid}>
            <Reveal delay={0.1}>
              <div className={s.shiftCard}>
                <h3>Une logique métier avant l'outil</h3>
                <p>
                  Les besoins sont cadrés à partir de l'activité réelle. L'outil
                  vient ensuite, avec la bonne forme, au bon niveau.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={s.shiftCard}>
                <h3>Des dispositifs simples à utiliser</h3>
                <p>
                  Un bon outil facilite la lecture, la prise d'information, le
                  suivi, l'organisation et les usages du quotidien.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className={s.shiftCard}>
                <h3>Une activité plus lisible</h3>
                <p>
                  Une présence claire rassure les futurs clients et donne à
                  l'activité une forme plus cohérente et plus professionnelle.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className={s.shiftCard}>
                <h3>Un accompagnement durable</h3>
                <p>
                  Mise en place, support, maintenance, formation et évolutions
                  dans une logique de continuité.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MOUVEMENT 4 · PREUVES ═══ */}
      <section className={s.proof}>
        <div className={s.proofInner}>
          <Reveal>
            <h2 className="section-title">Preuves de structure</h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              La valeur d'un outil se mesure à ce qu'il rend possible.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={s.proofFeatured}>
              <div className={s.proofVisual}>
                <span className={s.proofVisualName}>Bergfrid</span>
                <span className={s.proofLabel}>Étude de cas</span>
              </div>
              <div className={s.proofContent}>
                <h3>Bergfrid</h3>
                <p>
                  Architecture éditoriale, hiérarchie de l'information,
                  circulation entre les contenus, logique multilingue, parcours
                  de lecture, continuité de publication. Conçu comme un système
                  utile, lisible et évolutif.
                </p>
                <Link
                  href="https://www.bergfrid.com"
                  target="_blank"
                  rel="noopener"
                  className={s.proofLink}
                >
                  Visiter le projet →
                </Link>
              </div>
            </div>
          </Reveal>
          <div className={s.proofSecondary}>
            <Reveal delay={0.1}>
              <div className={s.proofSmall}>
                <h3>Le Geai Éditions</h3>
                <p className={s.proofSmallSub}>
                  Rendre une activité éditoriale plus claire et plus cohérente
                </p>
                <p>
                  Présentation des ouvrages, lisibilité de la structure,
                  cohérence de l'univers, accès aux informations essentielles.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={s.proofSmall}>
                <h3>Structuration Microsoft 365</h3>
                <p className={s.proofSmallSub}>
                  Mettre de l'ordre dans des outils souvent subis
                </p>
                <p>
                  Comptes, messagerie, licences, organisation et compréhension
                  de l'environnement clarifiés pour redonner une base sereine.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className={s.divider}>
        <div className={s.dividerLine} />
      </div>

      {/* ═══ MOUVEMENT 5 · MÉTHODE ═══ */}
      <section className={s.method}>
        <div className={s.methodInner}>
          <Reveal>
            <h2 className="section-title">Comment cela se passe</h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              Comprendre juste, construire proprement, laisser une base claire.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={s.methodSteps}>
              <div className={s.methodStep}>
                <p className={s.stepNumber}>1</p>
                <h3>Comprendre l'activité</h3>
                <p>
                  Cerner le métier, les usages, les irritants, les attentes et
                  les marges d'amélioration utiles.
                </p>
              </div>
              <div className={s.methodStep}>
                <p className={s.stepNumber}>2</p>
                <h3>Cadrer la réponse</h3>
                <p>
                  Site, refonte, Microsoft 365, outil ciblé, formation ou
                  combinaison : la bonne forme pour le bon besoin.
                </p>
              </div>
              <div className={s.methodStep}>
                <p className={s.stepNumber}>3</p>
                <h3>Mettre en place</h3>
                <p>
                  Lisibilité, cohérence, fiabilité. L'objectif n'est pas de
                  produire un effet, mais un outil exploitable.
                </p>
              </div>
              <div className={s.methodStep}>
                <p className={s.stepNumber}>4</p>
                <h3>Accompagner</h3>
                <p>
                  Prise en main, formation, suivi. Éviter que l'outil ne
                  devienne une charge de plus.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ MOUVEMENT 5B · TARIFS ═══ */}
      <section className={s.pricing}>
        <div className={s.pricingInner}>
          <Reveal>
            <h2 className="section-title">Tarifs clairs</h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              Un tarif cohérent rémunère une compréhension du besoin, une mise
              en place propre et une continuité dans le temps.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={s.pricingTable}>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Site de présentation</span>
                <span className={s.pricingValue}>dès 800 €</span>
              </div>
              <div className={s.pricingRow}>
                <span className={s.pricingLabel}>Site avec gestion</span>
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
              Chaque besoin ne demande pas la même réponse. Un échange permet de
              cadrer simplement ce qui est pertinent.
            </p>
            <div className={s.pricingCta}>
              <Link href="/contact" className="btn-ghost">
                Demander un cadrage →
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
              Parlons de ce qui peut améliorer votre activité
            </h2>
            <p className="section-sub" style={{ margin: "1.2rem auto 0" }}>
              Le bon outil n'est pas le plus spectaculaire. C'est celui qui
              répond à un besoin réel et tient dans le temps.
            </p>
          </Reveal>
          <div className={s.contactOptions}>
            <Reveal delay={0.1}>
              <div className={s.contactOption}>
                <h3>Échange rapide</h3>
                <p>
                  Une question, un besoin simple, une première prise de contact.
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
                  Décrivez votre activité, vos outils actuels et ce qui pose
                  problème. Nous reviendrons avec une analyse claire.
                </p>
                <Link href="/contact" className="btn-primary">
                  Décrire votre besoin <span>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <p className={s.contactBottom}>
              Réponse sous 48h ouvrées · Basé à Lyon · Disponible Lyon, Annecy,
              Clermont-Ferrand et partout en France
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
