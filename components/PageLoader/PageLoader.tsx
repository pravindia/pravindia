import { useEffect, useLayoutEffect, useState } from 'react';
import styles from './PageLoader.module.scss';

// useLayoutEffect runs before paint on the client; fall back to useEffect on the
// server to avoid the SSR warning. Hiding before paint stops the loader from
// flashing on repeat (already-loaded) visits.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PageLoader() {
  // Start shown so the backdrop covers the page from the very first paint —
  // otherwise the real page is briefly visible before the effect runs.
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const isLoaded = sessionStorage.getItem('pageLoaded');
    if (isLoaded) {
      setShow(false);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const newP = Math.min(100, p + Math.random() * 12);
        if (newP >= 100) clearInterval(progressInterval);
        return newP;
      });
    }, 80);

    const fadeTimeout = setTimeout(() => {
      setFading(true);
      const unmountTimeout = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('pageLoaded', 'true');
      }, 400);
      return () => clearTimeout(unmountTimeout);
    }, 1300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimeout);
    };
  }, []);

  if (!show) return null;

  const filled = Math.round(progress / 5);
  const empty = 20 - filled;
  const bar = ':'.repeat(filled) + ' '.repeat(empty);
  const pct = String(Math.round(progress)).padStart(3, ' ');

  return (
    <div className={`${styles.backdrop} ${fading ? styles.fading : ''}`}>
      <div className={styles.loader}>
        <span className={styles.bar}>[{bar}] {pct}%</span>
      </div>
    </div>
  );
}
