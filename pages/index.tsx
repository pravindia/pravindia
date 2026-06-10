import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Cursor from "../components/Cursor/Cursor";
import ParticleBackground from "../components/ParticleBackground/ParticleBackground";
import Works from "../components/Works/Works";
import TechStack from "../components/TechStack/TechStack";
import Interests from "../components/Interests/Interests";
import Timeline from "../components/Timeline/Timeline";
import Blog from "../components/Blog/Blog";
import ResumeModal from "../components/ResumeModal/ResumeModal";
import { Variants } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState<string>("inactive");
  const [resumeOpen, setResumeOpen] = useState(false);

  const experienceYears = (() => {
    const startYear = 2018;
    const startMonth = 4;
    const now = new Date();
    const totalMonths = (now.getFullYear() - startYear) * 12 + (now.getMonth() - startMonth);

    return (totalMonths / 12).toFixed(1);
  })();

  useEffect(() => {
    const mouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);
  const variants: Variants = {
    inactive: {
      x: mousePosition.x + 140,
      y: mousePosition.y - 16,
    },
    active: {
      x: mousePosition.x + 140,
      y: mousePosition.y - 16,
      color: "blue",
    },
  };

  const textEnter = () => setCursorVariant("active");
  const textLeave = () => setCursorVariant("inactive");

  const handleOpenResume = () => setResumeOpen(true);
  const handleCloseResume = () => setResumeOpen(false);

  return (
    <>
      <ParticleBackground />
      <Cursor variants={variants} curVariant={cursorVariant} />
      <Header />
      <ResumeModal open={resumeOpen} onClose={handleCloseResume} />
      <div className={styles.container}>
        <Head>
          <title>Pravin Kumar Govindaraju — Senior Software Developer</title>
          <meta name="description" content="Personal portfolio and blog of Pravin Kumar featuring software projects, technical writing, career highlights, and engineering expertise." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <section className={styles.home}>
            <div className={styles.heroContent}>
              <span className={styles.terminalLine}>
                <span className={styles.promptSymbol}>❯</span> whoami
              </span>
              <h1 className={styles.title} onMouseEnter={textEnter} onMouseLeave={textLeave}>
                <span className={styles.highlight}>Engineer. Developer. Startup Builder. </span>
              </h1>
              <p className={styles.description}>
                {"Hi! I'm"} <strong>Pravin Kumar</strong>{`, a Senior Software Developer with ${experienceYears} years of experience.`}
                {" I write code machines understand and people uses."}
              </p>
              <div className={styles.heroActions}>
                <a href="#works" className={styles.btnPrimary}>See my work</a>
                <button onClick={handleOpenResume} className={styles.btnSecondary}>Resumé ↗</button>
              </div>
            </div>
          </section>

          <Works />
          <TechStack />
          <Interests />
          <Timeline />
          <Blog />

          <section className={styles.learningSection} id="learning">
            <div className={styles.learningInner}>
              <div className={styles.heading}>
                <span className={styles.prompt}>pravindia@portfolio:~$</span>
                <h2>tail -f ~/learning.log</h2>
              </div>
              <div className={styles.learningGrid}>
                {[
                  { rank: "A", suit: "♠", name: "Model Context Protocol", abbr: "MCP", desc: "Protocol for connecting AI assistants to external tools, APIs, and data sources. Building custom MCP servers.", tilt: -2 },
                  { rank: "K", suit: "♣", name: "Retrieval-Augmented Generation", abbr: "RAG", desc: "Giving LLMs long-term memory by retrieving relevant context from vector databases at query time.", tilt: -1 },
                  { rank: "Q", suit: "♥", name: "LangChain / LangGraph", abbr: "LangChain", desc: "Framework for composing LLM-powered apps — chains, agents, memory.", tilt: 1 },
                  { rank: "J", suit: "♦", name: "Embeddings & Vector DBs", abbr: "Vectors", desc: "How text becomes numbers, similarity search, and semantic understanding.", tilt: 2 },
                ].map((item) => (
                  <div
                    key={item.abbr}
                    className={styles.playCard}
                    style={{ '--base-tilt': `${item.tilt}deg` } as React.CSSProperties}
                  >
                    <div className={styles.cardCorner}>
                      <div className={styles.rank}>{item.rank}</div>
                      <div className={styles.suit}>{item.suit}</div>
                    </div>
                    <div className={styles.cardCenter}>
                      {/* <span className={styles.icon}>{item.icon}</span> */}
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardName}>{item.name}</h3>
                        <code className={styles.cardAbbr}>{item.abbr}</code>
                        <p className={styles.cardDesc}>{item.desc}</p>
                      </div>
                    </div>
                    <div className={styles.cardCornerBR}>
                      <div className={styles.rank}>{item.rank}</div>
                      <div className={styles.suit}>{item.suit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer textLeave={textLeave} textEnter={textEnter} />
      </div>
    </>
  );
}
