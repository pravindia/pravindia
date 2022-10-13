import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pravin Kumar</title>
        <meta name="description" content="Hi, I'm Pravin Kumar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {"Hi, I'm"} <a href="">pravindia!</a>
        </h1>

        <p className={styles.description}>
          Frontend Web Developer / Flutter Engineer
        </p>
      </main>

      <footer className={styles.footer}>
          Built on Next.js

      </footer>
    </div>
  )
}

export default Home
