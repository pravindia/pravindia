import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getWorkBySlug, works } from "../../data/works";
import styles from "../../styles/WorkDetail.module.scss";

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: works.map((work) => ({ params: { slug: work.slug } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<{ slug: string }> = async ({ params }) => {
	const slug = typeof params?.slug === "string" ? params.slug : "";
	const work = getWorkBySlug(slug);

	if (!work) {
		return { notFound: true };
	}

	return {
		props: { slug },
	};
};

export default function WorkDetailPage({ slug }: InferGetStaticPropsType<typeof getStaticProps>) {
	const work = getWorkBySlug(slug);
	const textEnter = () => { };
	const textLeave = () => { };

	if (!work) {
		return null;
	}

	return (
		<>
			<Header />
			<div className={styles.page}>
				<Head>
					<title>{work.title} — Pravin Kumar</title>
					<meta name="description" content={work.summary} />
				</Head>

				<main className={styles.main}>
					<Link href="/works" className={styles.backLink}>← All works</Link>

					<div className={styles.hero}>
						<div className={styles.heroTop}>
							<span className={styles.status} data-status={work.status}>{work.status === "wip" ? "WIP" : "LIVE"}</span>
							<span className={styles.period}>{work.period}</span>
						</div>
						<h1 className={styles.title}>{work.title}</h1>
						<p className={styles.role}>{work.role}</p>
						<p className={styles.summary}>{work.description}</p>
					</div>

					<div className={styles.layout}>
						<section className={styles.panel}>
							<h2>Highlights</h2>
							<ul className={styles.list}>
								{work.highlights.map((highlight) => (
									<li key={highlight}>{highlight}</li>
								))}
							</ul>
						</section>

						<aside className={styles.sidebar}>
							<div className={styles.panel}>
								<h2>Stack</h2>
								<div className={styles.tags}>
									{work.tech.map((tech) => (
										<span key={tech} className={styles.tag}>{tech}</span>
									))}
								</div>
							</div>

							<div className={styles.panel}>
								<h2>Links</h2>
								<div className={styles.links}>
									{work.link ? (
										<a href={work.link} target="_blank" rel="noreferrer">Open live project ↗</a>
									) : (
										<span className={styles.muted}>Private project</span>
									)}
									{work.github ? (
										<a href={work.github} target="_blank" rel="noreferrer">GitHub ↗</a>
									) : (
										<span className={styles.muted}>No public repository</span>
									)}
								</div>
							</div>
						</aside>
					</div>
				</main>

				<Footer textEnter={textEnter} textLeave={textLeave} />
			</div>
		</>
	);
}