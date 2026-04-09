import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Microsoft 365 pour entreprises | Configuration, formation | Lyon",
  description: "Mise en place Microsoft 365 : domaine, email pro, Teams, SharePoint, formation. Licences incluses dès 29 €/utilisateur/mois. Lyon, Annecy.",
  alternates: { canonical: "https://www.legeai-informatique.fr/microsoft-365" },
};

export default function Microsoft365() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.service}>
        <Reveal>
          <h1>Microsoft 365 pour votre entreprise</h1>
          <p className={s.intro}>
            Domaine, email professionnel, Teams, SharePoint, formation et
            support. Un environnement de travail structuré, avec des licences
            incluses.
          </p>
        </Reveal>

        <div className={s.offers}>
          <Reveal delay={0.1}>
            <div className={s.offer}>
              <p className={s.tier}>Mise en place</p>
              <h2>Basique</h2>
              <p className={s.desc}>Domaine, profils, Teams, SharePoint. Licences incluses.</p>
              <p className={s.price}>29 €<span>/util./mois</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={s.offer}>
              <p className={s.tier}>Accompagnement</p>
              <h2>Complet</h2>
              <p className={s.desc}>Formation, boîtes mail partagées, support sous 48h. Licences incluses.</p>
              <p className={s.price}>49 €<span>/util./mois</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={s.offer}>
              <p className={s.tier}>Assistance</p>
              <h2>Support</h2>
              <p className={s.desc}>Support dédié sous 48h, jusqu'à 10 incidents par mois.</p>
              <p className={s.price}>100 €<span>/5 util./mois</span></p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className={s.cta}>
            <p>
              Un cadre propre pour vos outils de travail.{" "}
              <Link href="/tarifs">Voir tous les tarifs</Link> ou{" "}
              <Link href="/contact">nous écrire directement</Link>.
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
