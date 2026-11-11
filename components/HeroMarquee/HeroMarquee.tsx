import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import styles from "./HeroMarquee.module.scss";

const highlights = [
  "Backend Engineering",
  "Distributed Systems",
  "Applied AI",
  "TypeScript & Python",
  "Production AI Integrations",
  "Product Platforms",
];

export default function HeroMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div className={styles.marquee} ref={ref}>
      <div className={styles.viewport}>
        <div className={styles.track} style={{ animationPlayState: !inView || !visible ? "paused" : "running" }}>
          {[0, 1].map((copy) => (
            <ul className={styles.group} key={copy} aria-label={copy === 0 ? "Engineering focus areas" : undefined} aria-hidden={copy === 1 ? true : undefined}>
              {highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
