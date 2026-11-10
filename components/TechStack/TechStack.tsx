import { useEffect, useRef } from "react";
import styles from "./TechStack.module.scss";

const dailyConfident = [
	{ icon: "typescript-original", name: "TypeScript", svg: true },
	{ icon: "python-original", name: "Python", svg: true },
	{ icon: "angular-original", name: "Angular", svg: true },
	{ icon: "nextjs-original", name: "Next.js", svg: true },
	{ icon: "javascript-original", name: "JavaScript", svg: true },
	{ icon: "nodejs-original", name: "Node.js", svg: true },
	{ icon: "nestjs-original", name: "NestJS", svg: true },
	{ icon: "fastapi-original", name: "FastAPI", svg: true },
	{ icon: "flutter-original", name: "Flutter", svg: true },
	{ icon: "🔗", name: "REST APIs" },
	{ icon: "🏗️", name: "Microservices" },
	{ icon: "postgresql-original", name: "PostgreSQL", svg: true },
	{ icon: "mongodb-original", name: "MongoDB", svg: true },
	{ icon: "mysql-original", name: "MySQL", svg: true },
	{ icon: "redis-original", name: "Redis", svg: true },

];

const experimentingTools = [
	{ icon: "github-original", name: "Git / GitHub", svg: true },
	{ icon: "docker-original", name: "Docker", svg: true },
	{ icon: "amazonwebservices-original", name: "AWS (EC2, S3, Lambda)", svg: true },
	{ icon: "🔄", name: "CI/CD Pipelines" },
	{ icon: "digitalocean-original", name: "DigitalOcean", svg: true },
	{ icon: "vercel-original", name: "Vercel", svg: true },
	{ icon: "firebase-original", name: "Firebase", svg: true },
	{ icon: "🔌", name: "MCP" },
	{ icon: "elasticsearch-original", name: "Elasticsearch", svg: true },
	{ icon: "🧠", name: "RAG" },
	{ icon: "✨", name: "LLM Embeddings" },
	{ icon: "📊", name: "Vector DBs" },
	{ icon: "apachekafka-original", name: "Kafka", svg: true },
	{ icon: "socketio-original", name: "Socket.IO", svg: true },
];

export default function TechStack() {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let visible = false;
		let resetTimer: ReturnType<typeof setTimeout> | undefined;
		const setSpeed = (speed: number) => {
			section.querySelectorAll<HTMLElement>("[data-marquee-track]").forEach((track) => {
				track.getAnimations().forEach((animation) => animation.updatePlaybackRate(speed));
			});
		};
		const onScroll = () => {
			if (!visible || motion.matches) return;
			setSpeed(2);
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => setSpeed(1), 220);
		};
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			section.dataset.marqueeVisible = String(visible);
			if (!visible) {
				clearTimeout(resetTimer);
				setSpeed(1);
			}
		});
		observer.observe(section);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			observer.disconnect();
			clearTimeout(resetTimer);
		};
	}, []);
	const allChips1 = [...dailyConfident, ...dailyConfident];
	const allChips2 = [...experimentingTools, ...experimentingTools];

	return (
		<section ref={sectionRef} className={styles.section} id="stack">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<h2>Things I reach for</h2>
				</div>

				<div className={styles.rows}>
				<div className={styles.rowWrapper}>
					{/* <span className={styles.confidence}>more confident</span> */}
					<div className={styles.wrapper}>
						<div className={styles.track} data-marquee-track>
							{allChips1.map((chip, idx) => (
								<span key={`${chip.name}-${idx}`} className={styles.chip}>
									{"svg" in chip ? (
										<img
											className={`${styles.glyph} ${["Next.js", "Git / GitHub", "Vercel", "Kafka", "Socket.IO"].includes(chip.name) ? styles.lightGlyph : ""}`}
											src={`/icons/tech/${chip.icon}.svg`}
											alt=""
											aria-hidden="true"
										/>
									) : (
										<span className={styles.glyph} aria-hidden="true">{chip.icon}</span>
									)}
									{chip.name}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className={styles.rowWrapper}>
					{/* <span className={styles.confidence}>passionate & experimenting</span> */}
					<div className={styles.wrapper}>
						<div className={`${styles.track} ${styles.trackRev}`} data-marquee-track>
							{allChips2.map((chip, idx) => (
								<span key={`${chip.name}-${idx}`} className={styles.chip}>
									{"svg" in chip ? (
										<img
											className={`${styles.glyph} ${["Next.js", "Git / GitHub", "Vercel", "Kafka", "Socket.IO"].includes(chip.name) ? styles.lightGlyph : ""}`}
											src={`/icons/tech/${chip.icon}.svg`}
											alt=""
											aria-hidden="true"
										/>
									) : (
										<span className={styles.glyph} aria-hidden="true">{chip.icon}</span>
									)}
									{chip.name}
								</span>
							))}
						</div>
					</div>
				</div>
				</div>
			</div>
		</section>
	);
}
