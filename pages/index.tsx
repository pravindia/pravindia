import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Header from '../components/Header/Header';
import Timer from '../components/Timer/Timer';

export default function Home() {
  return (
    <>
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
      <main className={styles.main}>
        <h1 className={styles.title}>
        I <span>develop products</span> that delight and inspire people.
        </h1>

        <p className={styles.description}>
        Hi! I’m Pravin, a Software Developer based in Chennai. I create user-friendly websites and apps for fast-growing startups.
        </p>

      </main>

      <footer className={styles.footer}>
          Built on Next.js
      </footer>
    </div>
    </>
  )
}
