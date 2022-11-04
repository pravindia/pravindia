import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Header from "../components/Header/Header";
import Timer from "../components/Timer/Timer";
import Footer from "../components/Footer/Footer";
import Cursor from "../components/Cursor/Cursor";
import { Variants } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState<string>("inactive");
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
      color: 'blue'
    },
  };

  const textEnter = () => setCursorVariant("active");
  const textLeave = () => setCursorVariant("inactive");
  return (
    <>
      <Cursor variants={variants} curVariant={cursorVariant} />
      <Header></Header>
      <Timer />
      <div className={styles.container}>
        <div className={styles.background}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <Head>
          <title>Pravin Kumar</title>
          <meta name="description" content="Hi, I'm Pravin Kumar" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <section className={styles.home}>
            <h1 className={styles.title}>
              I <span>develop products</span> that delight and inspire people.
            </h1>
            <p className={styles.description}>
              Hi! I’m Pravin, a Software Developer based in Chennai. I create
              user-friendly websites and apps for fast-growing startups.
            </p>
          </section>
        </main>
        <Footer textLeave={textLeave} textEnter={textEnter}></Footer>
      </div>
    </>
  );
}
