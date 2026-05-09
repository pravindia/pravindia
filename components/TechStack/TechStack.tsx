import styles from "./TechStack.module.scss";

const dailyConfident = {
	Frontend: [
		"Angular",
		"React.js",
		"Next.js",
		"TypeScript",
		"JavaScript",
		"HTML5 / CSS3",
	],
	Backend: [
		"Node.js",
		"NestJS",
		"FastAPI",
		"Django",
		"Python",
		"REST APIs",
		"Microservices",
	],
	Data: [
		"PostgreSQL",
		"MongoDB",
		"MySQL",
		"Redis",
		"Elasticsearch",
	],
};

const passionateSideprojects = {
	"Tools & DevOps": [
		"Git / GitHub",
		"Docker",
		"CI/CD Pipelines",
		"AWS (EC2, S3, Lambda)",
		"DigitalOcean",
		"Vercel",
		"Firebase",
	],
	"🤖 Experimenting": [
		"MCP (Model Context Protocol)",
		"RAG (Retrieval-Augmented Gen)",
		"LLM Embeddings",
		"Vector Databases",
		"Kafka",
		"Socket.IO",
	],
};

const categoryColors: Record<string, string> = {
	Frontend: "blue",
	Backend: "green",
	Data: "purple",
	"Tools & DevOps": "orange",
	"🤖 Experimenting": "ai",
};

export default function TechStack() {
	return (
		<section className={styles.section} id="stack">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>/02</span>
					<h2>Things I reach for</h2>
				</div>

				{/* Row 1: Daily & Confident */}
				<div className={styles.rowWrapper}>
					<div className={styles.rowLabel}>
						<span className={styles.confidence}>more confident</span>
					</div>
					<div className={styles.categories}>
						{Object.entries(dailyConfident).map(([category, items]) => (
							<div key={category} className={styles.category} data-color={categoryColors[category]}>
								<h3 className={styles.catLabel}>{category}</h3>
								<div className={styles.pills}>
									{items.map((item) => (
										<span key={item} className={styles.pill} data-color={categoryColors[category]}>
											{item}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Row 2: Passionate & Sideprojects */}
				<div className={styles.rowWrapper}>
					<div className={styles.rowLabel}>
						<span className={styles.confidence}>passionate & sideprojects</span>
					</div>
					<div className={styles.categories}>
						{Object.entries(passionateSideprojects).map(([category, items]) => (
							<div key={category} className={styles.category} data-color={categoryColors[category]}>
								<h3 className={styles.catLabel}>{category}</h3>
								<div className={styles.pills}>
									{items.map((item) => (
										<span key={item} className={styles.pill} data-color={categoryColors[category]}>
											{item}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
