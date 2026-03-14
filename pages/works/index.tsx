import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { works } from "../../data/works";
import styles from "../../styles/WorksPage.module.scss";

export default function WorksPage() {
	const textEnter = () => { };
	const textLeave = () => { };

	return (
		<>
			<Header />
			<div className={styles.page}>
				<Head>
					<title>Works — Pravin Kumar</title>
					<meta name="description" content="Selected work and case studies by Pravin Kumar." />
				</Head>

				<main className={styles.main}>
					<div className={styles.hero}>
						<span className={styles.prompt}>pravindia@works:~$ ls -la ./projects</span>
						<h1 className={styles.title}>All Works</h1>
						<p className={styles.subtitle}>Selected backend systems, product platforms, and AI-enabled integrations.</p>
					</div>

					<div className={styles.grid}>
						{works.map((work) => (
							<Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
								<div className={styles.cardTop}>
									<span className={styles.status} data-status={work.status}>{work.status === "wip" ? "WIP" : "LIVE"}</span>
									<span className={styles.period}>{work.period}</span>
								</div>
								<h2 className={styles.cardTitle}>{work.title}</h2>
								<p className={styles.role}>{work.role}</p>
								<p className={styles.desc}>{work.summary}</p>
								<div className={styles.tags}>
									{work.tech.slice(0, 5).map((tech) => (
										<span key={tech} className={styles.tag}>{tech}</span>
									))}
								</div>
								<span className={styles.openLink}>Open case file →</span>
							</Link>
						))}
					</div>
				</main>

				<Footer textEnter={textEnter} textLeave={textLeave} />
			</div>
		</>
	);
}