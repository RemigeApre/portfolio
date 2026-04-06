import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © 2026{" "}
        <Link href="https://www.legeai-editions.com" target="_blank" rel="noopener">
          Le Geai Editions
        </Link>{" "}
        · Tous droits reserves
      </p>
    </footer>
  );
}
