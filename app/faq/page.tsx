import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Questions fréquentes | Site web, maintenance, Microsoft 365",
  description: "Reprise de site, suivi après livraison, Microsoft 365, domaines, cadrage. Réponses aux questions courantes. Le Geai Informatique, Lyon.",
  alternates: { canonical: "https://www.legeai-informatique.fr/faq" },
};

export default function FAQ() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.faq}>
        <Reveal>
          <h1>Questions fréquentes</h1>
        </Reveal>

        <div className={s.list}>
          <Reveal delay={0.08}>
            <div className={s.item}>
              <h2>Travaillez-vous avec de petites structures ?</h2>
              <p>
                Oui. Le Geai Informatique s'adresse aux activités qui cherchent
                un cadre propre, utile et durable. <Link href="/tarifs">Voir les repères tarifaires</Link>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className={s.item}>
              <h2>Reprenez-vous un site ou des outils déjà en place ?</h2>
              <p>
                Oui, selon l'état de l'existant. Un échange permet de distinguer
                ce qui mérite d'être conservé, corrigé ou reconstruit.{" "}
                <Link href="/creation-site-web">En savoir plus sur la création web</Link>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className={s.item}>
              <h2>Assurez-vous un suivi après la mise en place ?</h2>
              <p>
                Oui. Le suivi peut rester ponctuel ou s'inscrire dans la durée.{" "}
                <Link href="/maintenance-web">Voir les formules de maintenance</Link>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className={s.item}>
              <h2>Pouvez-vous gérer domaines, emails, Microsoft 365 et licences ?</h2>
              <p>
                Oui, lorsque le besoin le justifie. Le but est un cadre
                cohérent, avec moins de friction.{" "}
                <Link href="/microsoft-365">Voir l'offre Microsoft 365</Link>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className={s.item}>
              <h2>Comment se passe un premier cadrage ?</h2>
              <p>
                Le premier échange sert à comprendre l'activité, les usages, les
                irritants et les contraintes.{" "}
                <Link href="/contact">Initier l'échange</Link>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.48}>
            <div className={s.item}>
              <h2>Peut-on ajuster le périmètre ou le rythme selon la situation ?</h2>
              <p>
                Oui. Certaines situations demandent un cadre plus souple, un
                phasage ou une progression mesurée.
              </p>
            </div>
          </Reveal>
        </div>
      </article>
      </main>
      <Footer />
    </>
  );
}
