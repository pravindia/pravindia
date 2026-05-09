import { useEffect, useState } from 'react';
import styles from './ResumeModal.module.scss';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('connecting');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    setProgress(0);
    setStage('connecting');
    setReady(false);

    let p = 0;
    const stages = [
      { upTo: 22, label: 'connecting' },
      { upTo: 58, label: 'fetching' },
      { upTo: 92, label: 'rendering' },
      { upTo: 100, label: 'ready' },
    ];

    const t = setInterval(() => {
      p = Math.min(100, p + 2 + Math.random() * 4);
      setProgress(p);
      for (const s of stages) {
        if (p <= s.upTo) {
          setStage(s.label);
          break;
        }
      }
      if (p >= 100) {
        clearInterval(t);
        setReady(true);
      }
    }, 70);

    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <div className={styles.traffic}>
            <span style={{ background: '#ff5f57' }} />
            <span style={{ background: '#febc2e' }} />
            <span style={{ background: '#28c840' }} />
          </div>
          <div className={styles.title}>
            <span className={styles.filename}>Pravin Kumar</span>
            <span className={styles.source}>Software Engineer · 8 years · v2026.04</span>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            esc
          </button>
        </div>

        {!ready ? (
          <div className={styles.loader}>
            <div className={styles.loaderStatus}>
              <span className={styles.loaderDot} />
              <span className={styles.loaderStage}>{stage}</span>
              <span className={styles.loaderPath}>resume · pravindia.com/cv.pdf</span>
            </div>
            <div className={styles.loaderBar}>
              <div className={styles.loaderFill} style={{ width: progress + '%' }} />
            </div>
            <div className={styles.loaderStream}>
              {[
                'GET /cv.pdf',
                'HTTP 200 · 184kb',
                'signature: ed25519 ✓',
                'rendering page 1/2',
                'rendering page 2/2',
                'optimizing fonts',
              ].map((line, i) => (
                <div
                  key={i}
                  className={styles.loaderLine}
                  style={{ opacity: progress > i * 16 ? 1 : 0 }}
                >
                  <span className={styles.loaderPrompt}>›</span> {line}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.doc}>
            <div className={styles.docInner}>
              <iframe
                src="https://drive.google.com/file/d/1i1xcgy1VaEw1n1eI4p9JeZ2hJDLsw17K/preview"
                className={styles.pdfViewer}
                title="Pravin Kumar Resume"
              />
              <div className={styles.fade} />
            </div>

            <div className={styles.actions}>
              <a
                className={styles.btnPrimary}
                href="https://drive.google.com/file/d/1i1xcgy1VaEw1n1eI4p9JeZ2hJDLsw17K/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                <span>Download PDF</span>
                <span className={styles.arrow}>↓</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
