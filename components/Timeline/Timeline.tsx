import { useEffect, useRef } from "react";
import styles from "./Timeline.module.scss";

const experiences = [
	{
		role: "Senior Software Specialist | Tech Lead",
		company: "Tem Technologies Pvt. Ltd ( for Creative Wiz B.V )",
		companyUrl: "https://temtechnologies.com",
		period: "Jan 2023 — Present",
		location: "Hybrid (Chennai, India / Remote)",
		description:
			"Leading backend architecture and delivery for customs, warehouse, and e-commerce systems using Node.js, NestJS, Python microservices, Kafka-style event workflows, Redis caching, CI/CD, and infrastructure automation.",
		tags: ["NestJS", "TypeScript", "Python", "System Design", "Docker", "CI/CD", "AI Integrations"],
		current: true,
	},
	{
		role: "Senior Software Developer | Co-Founder",
		company: "Smazee",
		companyUrl: "https://smazee.com",
		period: "May 2018 — Dec 2022",
		location: "Chennai, India",
		description:
			"Co-founded and led a 4-5 member engineering team. Drove architecture and delivery across e-commerce, delivery, accounting, and e-learning products, and shipped multiple Flutter apps to Play Store and App Store.",
		tags: ["Flutter", "Node.js", "Angular", "Next.js", "Python", "PHP", "Team Leadership"],
		current: false,
	},
	{
		role: "Bachelor of Engineering in ECE",
		company: "",
		companyUrl: null,
		period: "2014 — 2018",
		location: "Chennai, India",
		description: "Engineering foundation in systems, electronics, and software fundamentals.",
		tags: ["Engineering", "Problem Solving"],
		current: false,
	},
];

export default function Timeline() {
	const sectionRef = useRef<HTMLElement>(null);
	const spinesRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const handleScroll = () => {
			const section = sectionRef.current;
			if (!section) return;

			const sectionTop = section.getBoundingClientRect().top;
			const sectionHeight = section.getBoundingClientRect().height;
			const windowHeight = window.innerHeight;

			// Progress: 0 when section top reaches bottom of viewport, 1 when section bottom reaches top
			const progressValue = Math.max(
				0,
				Math.min(1, (windowHeight - sectionTop) / (sectionHeight + windowHeight))
			);

			// Update each spine's progress sequentially
			const totalLines = spinesRef.current.filter(s => s).length - 1; // excluding last entry without line
			spinesRef.current.forEach((spine, idx) => {
				if (!spine) return;
				const lines = spine.querySelectorAll(`.${styles.line}`);
				lines.forEach(() => {
					// Each line gets a portion of the total scroll: divide into segments
					const segmentStart = (idx / totalLines);
					const segmentEnd = ((idx + 1) / totalLines);
					const lineProgress = Math.max(0, Math.min(1, (progressValue - segmentStart) / (segmentEnd - segmentStart)));
					(lines[0] as HTMLElement).style.setProperty('--line-progress', `${lineProgress * 100}%`);
				});
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<section className={styles.section} id="experience" ref={sectionRef}>
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>pravindia@portfolio:~$</span>
					<h2>git log --experience</h2>
				</div>

				<div className={styles.timeline}>
					{experiences.map((exp, i) => (
						<div
							key={i}
							className={styles.entry}
							data-current={exp.current}
						>
							<div
								className={styles.spine}
								ref={(el) => {
									spinesRef.current[i] = el;
								}}
							>
								<div className={styles.dot} />
								{i < experiences.length - 1 && <div className={styles.line} />}
							</div>

							<div className={styles.content}>
								<div className={styles.meta}>
									<time className={styles.period}>{exp.period}</time>
									<span className={styles.location}>{exp.location}</span>
								</div>

								<h3 className={styles.role}>{exp.role}</h3>

								<p className={styles.company}>
									{exp.companyUrl ? (
										<a href={exp.companyUrl} target="_blank" rel="noreferrer">
											{exp.company} ↗
										</a>
									) : (
										exp.company
									)}
								</p>

								<p className={styles.desc}>{exp.description}</p>

								<div className={styles.tags}>
									{exp.tags.map((t) => (
										<span key={t} className={styles.tag}>{t}</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
