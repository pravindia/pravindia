import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Cursor from "../components/Cursor/Cursor";
import Works from "../components/Works/Works";
import TechStack from "../components/TechStack/TechStack";
import Timeline from "../components/Timeline/Timeline";
import { Variants } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState<string>("inactive");

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
  return (
    <>
      <Cursor variants={variants} curVariant={cursorVariant} />
      <Header />
      <div className={styles.container}>
        <Head>
          <title>Pravin Kumar — Software Developer</title>
          <meta name="description" content="Software Developer based in Chennai. I build web apps and explore AI." />
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
                <a href="https://drive.google.com/file/d/1i1xcgy1VaEw1n1eI4p9JeZ2hJDLsw17K/view?usp=sharing" target="_blank" rel="noreferrer" className={styles.btnSecondary}>Resumé ↗</a>
              </div>
            </div>
          </section>

          <Works />
          <TechStack />
          <Timeline />

          <section className={styles.learningSection} id="learning">
            <div className={styles.learningInner}>
              <div className={styles.heading}>
                <span className={styles.prompt}>pravindia@portfolio:~$</span>
                <h2>tail -f ~/learning.log</h2>
              </div>
              <div className={styles.learningGrid}>
                {[
                  { icon: "🔌", name: "Model Context Protocol", abbr: "MCP", desc: "Protocol for connecting AI assistants to external tools, APIs, and data sources. Building custom MCP servers to supercharge AI workflows.", status: "active" },
                  { icon: "🧠", name: "Retrieval-Augmented Generation", abbr: "RAG", desc: "Giving LLMs long-term memory by retrieving relevant context from vector databases at query time. Exploring ChromaDB and pgvector.", status: "active" },
                  { icon: "⛓️", name: "LangChain / LangGraph", abbr: "LangChain", desc: "Framework for composing LLM-powered apps — chains, agents, memory. Using it to build document Q&A and agentic workflows.", status: "exploring" },
                  { icon: "🔢", name: "Embeddings & Vector DBs", abbr: "Vectors", desc: "How text becomes numbers, similarity search, and why semantic search beats keyword search for AI applications.", status: "exploring" },
                ].map((item) => (
                  <div key={item.abbr} className={styles.learningCard} data-status={item.status}>
                    <div className={styles.learningCardTop}>
                      <span className={styles.learningIcon}>{item.icon}</span>
                      <span className={styles.learningStatus} data-status={item.status}>
                        {item.status === "active" ? "▶ active" : "◎ exploring"}
                      </span>
                    </div>
                    <h3 className={styles.learningName}>{item.name}</h3>
                    <code className={styles.learningAbbr}>{item.abbr}</code>
                    <p className={styles.learningDesc}>{item.desc}</p>
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
