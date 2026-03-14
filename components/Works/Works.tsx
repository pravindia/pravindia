import styles from "./Works.module.scss";

const works = [
	{
		title: "Customs Clearance System (Netherlands)",
		description:
			"Built backend services with NestJS + Python microservices for Dutch import customs workflows, integrated with DMS/DECO, implemented secure IPSec VPN communication, and delivered an AI-assisted HS code recommendation flow.",
		tech: ["NestJS", "TypeScript", "Python", "Angular", "IPSec VPN", "LLM Embeddings"],
		link: null,
		github: null,
		status: "live",
	},
	{
		title: "SHAOKE Warehouse Management System",
		description:
			"Led backend from project kickoff to production: architecture, CI/CD, server setup, load balancing, and replication. Built parcel scanning APIs, OCR document extraction services, and real-time event workflows.",
		tech: ["Node.js", "FastAPI", "MySQL", "Redis", "Socket.IO", "Firebase", "Typesense", "Docker"],
		link: null,
		github: null,
		status: "live",
	},
	{
		title: "VersTrade B2B E-Commerce Platform",
		description:
			"Developed FastAPI backend services for inbound and parcel sorting workflows with SOAP integrations. Built and maintained Flutter apps (Android/iOS/Web) plus Node.js admin systems.",
		tech: ["FastAPI", "Flutter", "Node.js", "SOAP APIs", "Analytics Dashboards"],
		link: null,
		github: null,
		status: "live",
	},
	{
		title: "AI-Enabled Backend Integrations",
		description:
			"Built production-oriented AI features including OCR pipelines, context retrieval flows, and MCP/RAG based backend integrations for workflow automation and faster operations.",
		tech: ["RAG", "MCP", "Python", "Elasticsearch", "Redis", "Distributed Systems"],
		link: null,
		github: "https://github.com/pravindia",
		status: "wip",
	},
];

export default function Works() {
	return (
		<section className={styles.section} id="works">
			<div className={styles.inner}>

				<div className={styles.grid}>
					{works.map((w) => (
						<article key={w.title} className={styles.card}>
							<div className={styles.cardTop}>
								<span className={styles.status} data-status={w.status}>
									{w.status === "wip" ? "WIP" : "LIVE"}
								</span>
								<div className={styles.links}>
									{w.github && (
										<a href={w.github} target="_blank" rel="noreferrer" aria-label="GitHub">
											<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
												<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
											</svg>
										</a>
									)}
									{w.link && w.link !== "#" && (
										<a href={w.link} target="_blank" rel="noreferrer" aria-label="Live site">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
											</svg>
										</a>
									)}
								</div>
							</div>

							<h3 className={styles.title}>{w.title}</h3>
							<p className={styles.desc}>{w.description}</p>

							<div className={styles.tags}>
								{w.tech.map((t) => (
									<span key={t} className={styles.tag}>{t}</span>
								))}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
