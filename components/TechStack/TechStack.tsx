import styles from "./TechStack.module.scss";

const dailyConfident = [
	{ icon: "📘", name: "TypeScript" },
	{ icon: "🐍", name: "Python" },
	{ icon: "🔷", name: "Angular" },
	{ icon: "▲", name: "Next.js" },
	{ icon: "☕", name: "JavaScript" },
	{ icon: "🟢", name: "Node.js" },
	{ icon: "🦅", name: "NestJS" },
	{ icon: "⚡", name: "FastAPI" },
	{ icon: "🦋", name: "Flutter" },
	{ icon: "🔗", name: "REST APIs" },
	{ icon: "🏗️", name: "Microservices" },
	{ icon: "🐘", name: "PostgreSQL" },
	{ icon: "🍃", name: "MongoDB" },
	{ icon: "🐬", name: "MySQL" },
	{ icon: "⚡", name: "Redis" },

];

const experimentingTools = [
	{ icon: "🔗", name: "Git / GitHub" },
	{ icon: "🐳", name: "Docker" },
	{ icon: "☁️", name: "AWS (EC2, S3, Lambda)" },
	{ icon: "🔄", name: "CI/CD Pipelines" },
	{ icon: "☁️", name: "DigitalOcean" },
	{ icon: "▲", name: "Vercel" },
	{ icon: "🔥", name: "Firebase" },
	{ icon: "🔌", name: "MCP" },
	{ icon: "🔍", name: "Elasticsearch" },
	{ icon: "🧠", name: "RAG" },
	{ icon: "✨", name: "LLM Embeddings" },
	{ icon: "📊", name: "Vector DBs" },
	{ icon: "🚂", name: "Kafka" },
	{ icon: "🔌", name: "Socket.IO" },
];

export default function TechStack() {
	const allChips1 = [...dailyConfident, ...dailyConfident];
	const allChips2 = [...experimentingTools, ...experimentingTools];

	return (
		<section className={styles.section} id="stack">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>/02</span>
					<h2>Things I reach for</h2>
				</div>

				<div className={styles.rowWrapper}>
					{/* <span className={styles.confidence}>more confident</span> */}
					<div className={styles.wrapper}>
						<div className={styles.track}>
							{allChips1.map((chip, idx) => (
								<span key={`${chip.name}-${idx}`} className={styles.chip}>
									<span className={styles.glyph}>{chip.icon}</span>
									{chip.name}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className={styles.rowWrapper}>
					{/* <span className={styles.confidence}>passionate & experimenting</span> */}
					<div className={styles.wrapper}>
						<div className={`${styles.track} ${styles.trackRev}`}>
							{allChips2.map((chip, idx) => (
								<span key={`${chip.name}-${idx}`} className={styles.chip}>
									<span className={styles.glyph}>{chip.icon}</span>
									{chip.name}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
