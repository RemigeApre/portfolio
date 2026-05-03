import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.services}>
        <Link href="/creation-site-web">Création web</Link>
        <Link href="/maintenance-web">Maintenance</Link>
        <Link href="/microsoft-365">Microsoft 365</Link>
        <Link href="/logiciel-sur-mesure">Sur mesure</Link>
        <Link href="/data-engineering">Data & formation</Link>
      </div>
      <div className={styles.links}>
        <Link href="/tarifs">Tarifs</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/confidentialite">Confidentialité</Link>
      </div>
      <p>
        © 2026{" "}
        <Link href="https://www.legeai-editions.com" target="_blank" rel="noopener">
          Le Geai
        </Link>{" "}
        · Tous droits réservés
      </p>
    </footer>
  );
}
