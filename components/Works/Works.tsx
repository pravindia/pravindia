import { useEffect, useRef, useState } from "react";
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
		title: "Warehouse Management System",
		description:
			"Led backend from project kickoff to production: architecture, CI/CD, server setup, load balancing, and replication. Built parcel scanning APIs, OCR document extraction services, and real-time event workflows.",
		tech: ["Node.js", "FastAPI", "MySQL", "Redis", "Socket.IO", "Firebase", "Typesense", "Docker"],
		link: null,
		github: null,
		status: "live",
	},
	{
		title: "B2B E-Commerce Platform",
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
		// github: "https://github.com/pravindia",
		github: null,
		status: "wip",
	},
	{
		title: "E-Learning Platform",
		description:
			"Built a full-stack e-learning platform with React.js frontend, Django backend, and Postgres database. Implemented features like course management, user authentication, progress tracking, and interactive quizzes.",
		tech: ["React.js", "Django", "Postgres", "TypeScript", "Python", "REST APIs"],
		link: null,
		github: null,
		status: "live",
	},
];

export default function Works() {
	const gridRef = useRef<HTMLDivElement>(null);
	const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setVisibleCards((prev) => new Set(prev).add(entry.target.getAttribute("data-work") || ""));
					}
				});
			},
			{ threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
		);

		const cards = gridRef.current?.querySelectorAll("[data-work]");
		cards?.forEach((card) => observer.observe(card));

		return () => {
			cards?.forEach((card) => observer.unobserve(card));
		};
	}, []);

	const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
		const card = e.currentTarget;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		card.style.setProperty('--mx', `${x}px`);
		card.style.setProperty('--my', `${y}px`);
	};

	return (
		<section className={styles.section} id="works">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>/01</span>
					<h2>Selected works</h2>
				</div>
				<div className={styles.grid} ref={gridRef}>
					{works.map((w, idx) => (
						<article
							key={w.title}
							className={`${styles.card} ${visibleCards.has(w.title) ? styles.visible : ""}`}
							data-work={w.title}
							style={{ animationDelay: `${idx * 0.1}s` }}
							onMouseMove={handleMouseMove}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.setProperty('--mx', '50%');
								(e.currentTarget as HTMLElement).style.setProperty('--my', '50%');
							}}
						>
							<div className={styles.spot} />

							<div className={styles.head}>
								<span className={styles.index}>{String(idx + 1).padStart(2, '0')}</span>
								<span className={styles.year}>2025</span>
							</div>

							<div className={styles.body}>
								<h3 className={styles.title}>{w.title}</h3>
								<p className={styles.tag}>{w.status === "live" ? "live" : "wip"}</p>
								<p className={styles.desc}>{w.description}</p>

								<div className={styles.stack}>
									{w.tech.map((t) => (
										<span key={t} className={styles.pill}>{t}</span>
									))}
								</div>
							</div>

							<a href="#" className={styles.arrow}>
								case study <span>↗</span>
							</a>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
