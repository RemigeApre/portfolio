import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        <Link href="/faq">FAQ</Link>
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
