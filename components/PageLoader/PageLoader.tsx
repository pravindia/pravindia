import { useEffect, useState } from 'react';
import styles from './PageLoader.module.scss';

export default function PageLoader() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const isLoaded = sessionStorage.getItem('pageLoaded');
    if (isLoaded) return;

    setShow(true);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const newP = Math.min(100, p + Math.random() * 12);
        if (newP >= 100) {
          clearInterval(progressInterval);
        }
        return newP;
      });
    }, 80);

    // Terminal lines appear
    const lineTimings = [150, 350, 550, 750, 950];
    const lineTimeouts = lineTimings.map((delay) =>
      setTimeout(() => setLines((l) => l + 1), delay)
    );

    // Fade out and mark as loaded
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
      lineTimeouts.forEach((t) => clearTimeout(t));
      clearTimeout(fadeTimeout);
    };
  }, []);

  if (!show) return null;

  const logLines = [
    '> booting environment',
    '> loading assets',
    '> initializing client',
    '> rendering components',
    '> ready',
  ];

  return (
    <div className={`${styles.backdrop} ${fading ? styles.fading : ''}`}>
      <div className={styles.container}>
        <div className={styles.terminal}>
          <div className={styles.prompt}>
            pravindia@portfolio:~ <span className={styles.blink}>$</span>
          </div>

          <div className={styles.stream}>
            {logLines.slice(0, lines).map((line, i) => (
              <div key={i} className={styles.line}>
                <span className={styles.arrow}>›</span> {line}
              </div>
            ))}
          </div>

          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
