import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main-content">
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center" as const,
        padding: "8rem 2rem 4rem",
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(4rem, 10vw, 8rem)",
          color: "var(--text)",
          opacity: 0.06,
          lineHeight: 1,
          marginBottom: "2rem",
        }}>
          404
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          color: "var(--text)",
          marginBottom: "1rem",
        }}>
          Page introuvable
        </h1>
        <p style={{
          fontSize: "0.9rem",
          color: "rgba(232, 226, 212, 0.5)",
          fontWeight: 300,
          marginBottom: "2rem",
        }}>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link href="/" style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "var(--gold)",
          border: "1px solid rgba(180, 154, 74, 0.25)",
          padding: "0.8rem 2rem",
          transition: "all 0.4s ease",
        }}>
          Retour à l'accueil
        </Link>
      </div>
      </main>
      <Footer />
    </>
  );
}
