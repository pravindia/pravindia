import styles from "./TechStack.module.scss";

const stack = {
	Frontend: [
		"Angular",
		"React.js",
		"Next.js",
		"TypeScript",
		"JavaScript",
		"Flutter (Web)",
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
		"Event-Driven Architecture",
		"Kafka",
		"Socket.IO",
	],
	Data: [
		"PostgreSQL",
		"MongoDB",
		"MySQL",
		"Redis",
		"Firestore",
		"Elasticsearch",
	],
	"Tools & DevOps": [
		"Git / GitHub",
		"Docker",
		"CI/CD Pipelines",
		"AWS (EC2, S3, Lambda, CloudFormation)",
		"DigitalOcean",
		"Vercel",
		"Firebase",
		"Sentry",
		"Jest",
	],
	"🤖 Currently Learning": [
		"MCP (Model Context Protocol)",
		"RAG (Retrieval-Augmented Gen)",
		"LLM Embeddings + Similarity Search",
		"Vector Databases",
		"AI Workflow Automation",
	],
};

const categoryColors: Record<string, string> = {
	Frontend: "blue",
	Backend: "green",
	Data: "purple",
	"Tools & DevOps": "orange",
	"🤖 Currently Learning": "ai",
};

export default function TechStack() {
	return (
		<section className={styles.section} id="stack">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>pravindia@portfolio:~$</span>
					<h2>cat tech-stack.json</h2>
				</div>

				<div className={styles.categories}>
					{Object.entries(stack).map(([category, items]) => (
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
		</section>
	);
}
