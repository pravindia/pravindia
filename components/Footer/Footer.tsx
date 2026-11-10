import { useEffect, useState } from "react";
import Link from "next/link";
import GitHubGrid from "../GitHubGrid/GitHubGrid";
import LocalClock from "./LocalClock";
import SocialIcon from "./SocialIcon";
import styles from "./Footer.module.scss";

const quickLinks = [
  ["Work", "/works"], ["Scribble", "/blog"], ["Coding", "/coding"],
  ["Typing", "/typing"], ["Developers", "/developers"],
] as const;
const socials = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/pravindia" },
  { name: "GitHub", url: "https://github.com/pravindia" },
  { name: "WakaTime", url: "https://wakatime.com/@pravindia" },
] as const;

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

export default function Footer({ textEnter, textLeave }: { textEnter?: () => void; textLeave?: () => void }) {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => { setEmail(["hello", "pravindia.com"].join("@")); }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.contact}>
            <h2>Good things start<br />with a conversation<span>.</span></h2>
            <p>Projects, opportunities, or a good technical rabbit hole.<br className={styles.desktopBreak} /> I’d love to hear from you.</p>
            {email ? <a className={styles.email} href={`mailto:${email}`} onMouseEnter={textEnter} onMouseLeave={textLeave}>{email}<Arrow /></a> : <span className={styles.email}>Let’s connect<Arrow /></span>}
          </div>
          <nav className={styles.links} aria-label="Footer navigation">
            <h3>Explore</h3>
            {quickLinks.map(([label, href]) => <Link key={href} href={href}>{label}<Arrow /></Link>)}
          </nav>
          <div className={styles.links}>
            <h3>Elsewhere</h3>
            {socials.map(({name, url}) => <a key={name} href={url} target="_blank" rel="noopener noreferrer"><span className={styles.socialName}><SocialIcon name={name} />{name}</span><Arrow /><span className={styles.srOnly}> (opens in a new tab)</span></a>)}
            <div className={styles.clock}><span>My local time · India</span><LocalClock /></div>
          </div>
        </div>
        <div className={styles.signature} aria-hidden="true">pravindia<span>_</span></div>
        <div className={styles.baseline}>
          <figure className={styles.quote}>
            <blockquote>“Simplicity does not precede complexity, but follows it.”</blockquote>
            <figcaption><a href="https://www.cs.yale.edu/homes/perlis-alan/quotes.html" target="_blank" rel="noopener noreferrer">Alan Perlis · Epigrams in Programming</a></figcaption>
          </figure>
          <a className={styles.backTop} href="#" aria-label="Back to top">Back to top <Arrow /></a>
        </div>
        <div className={styles.credits}><span>© {new Date().getFullYear()} Pravin Kumar</span><span>Always learning. Always building.</span></div>
      </div>
      <div className={styles.activityStrip}><GitHubGrid variant="section" /></div>
    </footer>
  );
}
