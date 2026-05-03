import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import s from "./page.module.css";

export const metadata = {
  title: "Politique de confidentialité | Le Geai Informatique",
  description: "Politique de confidentialité Le Geai Informatique : données collectées, finalités, droits des personnes, cookies, sécurité.",
  alternates: { canonical: "https://www.legeai-informatique.fr/confidentialite" },
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <article className={s.legal}>
        <Reveal>
          <h1>Politique de confidentialité</h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className={s.intro}>
            Le présent site peut recueillir certaines données personnelles
            lorsque vous utilisez un formulaire de contact, demandez un cadrage,
            ou transmettez volontairement des informations dans le cadre d'un
            échange professionnel. L'objectif de cette politique est de vous
            informer de manière simple sur les données recueillies, leur usage et
            vos droits.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <section>
            <h2>Responsable du traitement</h2>
            <p><strong>Le Geai</strong> — Lucas Gaio dos Santos</p>
            <p>31 rue Pasteur, 69007 Lyon</p>
            <p>administration@legeai-editions.com</p>
            <p>+33 4 82 53 25 64</p>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section>
            <h2>Données pouvant être collectées</h2>
            <p>Selon les formulaires et échanges, les données suivantes peuvent être recueillies :</p>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Nom de l'entreprise ou de l'activité</li>
              <li>Contenu du message</li>
              <li>Informations utiles au cadrage du besoin</li>
              <li>Toute donnée transmise volontairement dans le cadre d'un échange</li>
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.25}>
          <section>
            <h2>Finalités du traitement</h2>
            <p>Les données transmises servent à :</p>
            <ul>
              <li>Répondre à une prise de contact</li>
              <li>Analyser un besoin</li>
              <li>Proposer un cadrage ou une réponse adaptée</li>
              <li>Assurer le suivi des échanges</li>
              <li>Conserver un historique professionnel utile au traitement du dossier</li>
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.25}>
          <section>
            <h2>Base légale</h2>
            <p>
              Le traitement repose, selon les cas, sur l'exécution de mesures
              précontractuelles à votre demande, lorsque vous sollicitez un
              échange ou un cadrage, et sur l'intérêt légitime de Le Geai à
              répondre aux demandes professionnelles reçues et à assurer le suivi
              des échanges.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <section>
            <h2>Destinataires des données</h2>
            <p>
              Les données sont destinées uniquement aux personnes habilitées au
              sein de Le Geai, dans la limite nécessaire au traitement de votre
              demande. Elles ne sont ni vendues ni cédées à des tiers à des fins
              commerciales.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <section>
            <h2>Durée de conservation</h2>
            <p>
              Les données sont conservées pendant une durée adaptée à la finalité
              du dossier : le temps nécessaire au traitement de la demande, puis,
              selon les cas, pendant une durée raisonnable de suivi professionnel
              ou d'archivage administratif.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.35}>
          <section>
            <h2>Droits des personnes</h2>
            <p>Vous pouvez demander :</p>
            <ul>
              <li>L'accès à vos données</li>
              <li>Leur rectification</li>
              <li>Leur effacement</li>
              <li>La limitation du traitement</li>
              <li>Vous opposer au traitement lorsque cela s'applique</li>
              <li>Demander la portabilité lorsque cela s'applique</li>
            </ul>
            <p>
              Pour exercer vos droits : administration@legeai-editions.com
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.35}>
          <section>
            <h2>Cookies et traceurs</h2>
            <p>
              À ce jour, le site n'utilise pas de cookies ou traceurs soumis à
              consentement. Si des outils de mesure ou de services tiers venaient
              à être ajoutés ultérieurement, cette politique serait mise à jour en
              conséquence.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.4}>
          <section>
            <h2>Sécurité</h2>
            <p>
              Le Geai met en œuvre des mesures raisonnables de sécurité,
              d'organisation et de limitation d'accès afin de protéger les données
              transmises.
            </p>
          </section>
        </Reveal>
      </article>
      </main>
      <Footer />
    </>
  );
}
