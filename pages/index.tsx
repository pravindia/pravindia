import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Header from "../components/Header/Header";
import Timer from "../components/Timer/Timer";
import Footer from "../components/Footer/Footer";
import Cursor from "../components/Cursor/Cursor";
import { Variants } from "framer-motion";
import { CSSProperties, useEffect, useState } from "react";

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
  const colors = ['purple', 'green', 'blue', 'yellow']
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
        <main className={styles.bgdark}>
          <section className={styles.home}>
            <div style={{maxWidth:"50vmax"}}>
              <h1 className={styles.title}>
                I <span onMouseLeave={textLeave} onMouseEnter={textEnter}>develop products</span> that delight and inspire people.
              </h1>
            </div>
            <p className={styles.description}>
              Hi! I’m Pravin, a Software Developer based in Chennai. I create
              user-friendly websites and apps for fast-growing startups.
            </p>
          </section>
          {/* <section className={styles.about}>
            <h3>💻 Selected work</h3> 
            <div className="">
              
            </div>
          </section> */}
        </main>
        <Footer textLeave={textLeave} textEnter={textEnter}></Footer>
      </div>
    </>
  );
}
