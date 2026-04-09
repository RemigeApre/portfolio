import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Questions fréquentes | Le Geai Informatique",
  description: "Réponses aux questions les plus courantes sur les prestations de Le Geai Informatique.",
};

export default function FAQ() {
  const questions = [
    {
      q: "Travaillez-vous avec de petites structures ?",
      a: "Oui. Le site s'adresse justement aux activités qui cherchent un cadre plus propre, plus utile et plus durable, sans lourdeur inutile.",
    },
    {
      q: "Reprenez-vous un site ou des outils déjà en place ?",
      a: "Oui, selon l'état de l'existant. Un échange permet de distinguer ce qui mérite d'être conservé, corrigé, simplifié ou reconstruit.",
    },
    {
      q: "Assurez-vous un suivi après la mise en place ?",
      a: "Oui. Selon le besoin, le suivi peut rester ponctuel ou s'inscrire dans la durée, avec maintenance, accompagnement, ajustements et continuité.",
    },
    {
      q: "Pouvez-vous gérer domaines, emails, Microsoft 365 et licences ?",
      a: "Oui, lorsque le besoin le justifie. Le but est de garder un cadre cohérent, avec moins de friction et moins d'intermédiaires inutiles.",
    },
    {
      q: "Comment se passe un premier cadrage ?",
      a: "Le premier échange sert à comprendre l'activité, les usages en place, les irritants, les objectifs et les contraintes. À partir de là, un cadre plus juste peut être proposé.",
    },
    {
      q: "Peut-on ajuster le périmètre ou le rythme selon la situation ?",
      a: "Oui. Certaines situations demandent un cadre plus souple, un phasage, un échelonnement ou une progression plus mesurée.",
    },
  ];

  return (
    <>
      <Nav />
      <article className={s.faq}>
        <Reveal>
          <h1>Questions fréquentes</h1>
        </Reveal>

        <div className={s.list}>
          {questions.map((item, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)}>
              <div className={s.item}>
                <h2>{item.q}</h2>
                <p>{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </article>
      <Footer />
    </>
  );
}
