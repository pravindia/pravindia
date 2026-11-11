import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Works.module.scss";
import { works } from "../../data/works";

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
								<span className={styles.year}>{w.period}</span>
							</div>

							<div className={styles.body}>
								<h3 className={styles.title}>{w.title}</h3>
								<p className={styles.tag}>{w.status}</p>
								<p className={styles.desc}>{w.description}</p>

								<div className={styles.stack}>
									{w.tech.map((t) => (
										<span key={t} className={styles.pill}>{t}</span>
									))}
								</div>
							</div>

							<Link href={`/works/${w.slug}`} className={styles.arrow}>
								case study <span>↗</span>
							</Link>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
