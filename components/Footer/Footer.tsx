import { useEffect, useState } from "react";
import GitHubGrid from "../GitHubGrid/GitHubGrid";
import styles from "./Footer.module.scss";

const Footer = (props: { textEnter: any; textLeave: any }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    // Assembled client-side — never in static HTML
    setEmail(["hello", "pravindia.com"].join("@"));
    setPhone(["+91", "8870", "142519"].join(" "));
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.activityStrip}>
        <GitHubGrid variant="section" />
      </div>

      <div className={styles.contactRow}>
        {phone ? (
          <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
        ) : (
          <span aria-hidden="true" />
        )}
        {email ? (
          <a href={`mailto:${email}`}>{email}</a>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
      <div className={styles.socialRow}>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/pravindia"
        >
          LinkedIn
        </a>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          target="_blank"
          rel="noreferrer"
          href="https://codepen.io/pravindia"
        >
          Codepen
        </a>
      </div>
    </footer>
  );
};

export default Footer;
