import { useEffect, useRef, useState } from "react";
import styles from "./Footer.module.scss";

const words = ["coffee ☕️", "converśation.", "question ?", "hēllo!", "feëdback 💬"];
const symbols = "ċ!â>/śel=t*?#_ñ";

export default function ScrambleWord() {
  const element = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState("conversation");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 1;
    let visible = false;
    let frame = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      cancelAnimationFrame(frame);
      setText(words[index]);
    };
    const rotate = () => {
      const previous = words[index];
      index = (index + 1) % words.length;
      const next = words[index];
      const start = performance.now();
      const length = Math.max(previous.length, next.length);
      const settleAt = Array.from({ length }, () => 180 + Math.random() * 500);
      let lastUpdate = 0;
      const draw = (now: number) => {
        const elapsed = now - start;
        if (elapsed >= 700) { setText(next); return; }
        if (now - lastUpdate >= 45) {
          setText(Array.from({ length }, (_, i) => elapsed >= settleAt[i]
            ? next[i] || ""
            : elapsed < 100 ? previous[i] || "" : symbols[Math.floor(Math.random() * symbols.length)]).join(""));
          lastUpdate = now;
        }
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      stop();
      if (visible && !document.hidden && !preference.matches) timer = setInterval(rotate, 4000);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    if (element.current) observer.observe(element.current);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      if (timer) clearInterval(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, []);

  return <span ref={element} className={styles.scrambleWord} aria-hidden="true">
    <span className={styles.wordMeasure}>conversation.</span>
    <span className={styles.wordText}>{text}</span>
  </span>;
}
