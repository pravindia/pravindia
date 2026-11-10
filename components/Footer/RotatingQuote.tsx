import { useEffect, useState } from "react";
import styles from "./Footer.module.scss";

const perlis = "https://www.cs.yale.edu/homes/perlis-alan/quotes.html";
const pike = "https://www.lysator.liu.se/c/pikestyle.html";
const quotes = [
  { text: "Simplicity does not precede complexity, but follows it.", author: "Alan Perlis", source: perlis },
  { text: "Data dominates.", author: "Rob Pike", source: pike },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", source: "https://lkml.org/lkml/2000/8/25/132" },
  { text: "Optimization hinders evolution.", author: "Alan Perlis", source: perlis },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth", source: "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1184/styleguide.shtml" },
  { text: "Measure.", author: "Rob Pike", source: pike },
  { text: "Given enough eyeballs, all bugs are shallow.", author: "Eric S. Raymond", source: "http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s04.html" },
  { text: "Everything should be built top-down, except the first time.", author: "Alan Perlis", source: perlis },
  { text: "Fancy algorithms are slow when n is small.", author: "Rob Pike", source: pike },
  { text: "The tools we use have a profound (and devious!) influence on our thinking habits, and, therefore, on our thinking abilities.", author: "Edsger W. Dijkstra", source: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html" },
];

export default function RotatingQuote() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    // Advance on each visit, then rotate slowly enough to read the full quote.
    let initial = Math.floor(Math.random() * quotes.length);
    try {
      const previous = sessionStorage.getItem("footer-quote");
      if (previous !== null && Number.isInteger(Number(previous))) initial = (Number(previous) + 1) % quotes.length;
      sessionStorage.setItem("footer-quote", String(initial));
    } catch { /* Storage may be unavailable in private browsing. */ }
    setIndex(initial);
    const timer = window.setInterval(() => setIndex(current => (current + 1) % quotes.length), 15000);
    return () => window.clearInterval(timer);
  }, []);
  const quote = quotes[index];
  return <figure className={styles.quote}>
    <blockquote>“{quote.text}”</blockquote>
    <figcaption><a href={quote.source} target="_blank" rel="noopener noreferrer">{quote.author}</a></figcaption>
  </figure>;
}
