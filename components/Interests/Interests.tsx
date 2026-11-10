import { useEffect, useRef, useState } from "react";
import styles from "./Interests.module.scss";

type Group = "core" | "lang" | "life";
type Interest = { label: string; group: Group; hub?: boolean };

const interests: Interest[] = [
	{ label: "SOFTWARE ENGINEERING", group: "core", hub: true },
	{ label: "distributed systems", group: "core",},
	{ label: "system architecture", group: "core", hub: true },
	{ label: "message queues", group: "core" },
	{ label: "observability", group: "core" },
	{ label: "postgres", group: "core" },
	{ label: "microservices", group: "core" },
	{ label: "event-driven systems", group: "core" },
	{ label: "caching", group: "core" },
	{ label: "cloud infrastructure", group: "core" },
	// 
	{ label: "AI integrations", group: "core", hub: true },
	{ label: "retrieval & RAG", group: "core" },
	{ label: "LLM workflows", group: "core" },
	{ label: "vector databases", group: "core" },
	{ label: "model context protocol", group: "core" },
	{ label: "python", group: "lang", hub: true },
	{ label: "typescript", group: "lang", hub: true },
	{ label: "dart", group: "lang" },
	{ label: "javascript", group: "lang" },
	{ label: "node.js", group: "lang" },
	{ label: "flutter", group: "lang" },
	// 
	{ label: "OFF SCREEN", group: "life", hub: true },
	{ label: "Aquascaping", group: "life",},
	{ label: "electronics", group: "life" },
	{ label: "pour-over coffee", group: "life" },
	{ label: "Beethoven Symphony", group: "life" },
	{ label: "music & movies", group: "life" },
	{ label: "swimming", group: "life" },
	{ label: "Watch Connoisseur", group: "life" },
];

// Each topic sits around its group's hub on the surface of the sphere.
const clusters = [
	{ hub: "SOFTWARE ENGINEERING", items: [ "distributed systems", "system architecture", "message queues", "observability", "microservices", "event-driven systems", "caching", "cloud infrastructure", "postgres"] },
	{ hub: "AI integrations", items: ["retrieval & RAG", "LLM workflows", "vector databases", "model context protocol", "python"] },
	{ hub: "typescript", items: ["javascript", "node.js", "dart", "flutter", "python"] },
	{ hub: "OFF SCREEN", items: [ "Aquascaping", "electronics", "pour-over coffee", "Beethoven Symphony", "music & movies", "swimming", "Watch Connoisseur"] },
];
// Evenly distribute topics over the globe; relationships remain defined by clusters.
const points = interests.map((interest, index) => {
	const y = 1 - (2 * (index + 0.5)) / interests.length;
	const radius = Math.sqrt(1 - y * y);
	const longitude = index * Math.PI * (3 - Math.sqrt(5));
	return { ...interest, x: Math.cos(longitude) * radius, y, z: Math.sin(longitude) * radius };
});

const edges = clusters.flatMap((cluster) => {
	const hub = points.findIndex((point) => point.label === cluster.hub);
	if (hub < 0) return [];
	return cluster.items.flatMap((name) => {
		const item = points.findIndex((point) => point.label === name);
		return item < 0 ? [] : [[hub, item] as const];
	});
});

const colors: Record<Group, string> = { core: "#39d353", lang: "#ff6a2b", life: "#4a90ff" };
const SIZE = 760;
const CENTER = SIZE / 2;
const RADIUS = 270;

export default function Interests() {
	const [angle, setAngle] = useState(0);
	const [tilt, setTilt] = useState(0.28);
	const [hovered, setHovered] = useState<number | null>(null);
	const drag = useRef<{ x: number; y: number; pointerId: number } | null>(null);
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;
		let previous = 0;
		let visible = false;
		let lastScroll = -Infinity;
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (!visible) lastScroll = -Infinity;
		});
		if (sectionRef.current) observer.observe(sectionRef.current);
		const onScroll = () => {
			if (visible && !reducedMotion.matches) lastScroll = performance.now();
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		const animate = (time: number) => {
			const boost = Math.max(0, 1 - (time - lastScroll) / 450);
			if (previous && !drag.current) setAngle((value) => value + Math.min(time - previous, 50) * 0.000075 * (1 + boost));
			previous = time;
			frame = requestAnimationFrame(animate);
		};
		const update = () => {
			cancelAnimationFrame(frame);
			previous = 0;
			if (!reducedMotion.matches) frame = requestAnimationFrame(animate);
		};
		update();
		reducedMotion.addEventListener("change", update);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener("scroll", onScroll);
			reducedMotion.removeEventListener("change", update);
		};
	}, []);

	const projected = points.map((point) => {
		const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
		const z = point.z * Math.cos(angle) - point.x * Math.sin(angle);
		// A slight tilt makes the rotation read as a globe rather than a flat wheel.
		const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
		const depth = point.y * Math.sin(tilt) + z * Math.cos(tilt);
		return { ...point, px: CENTER + x * RADIUS, py: CENTER - y * RADIUS, depth };
	});

	return (
		<section ref={sectionRef} className={styles.section} id="interests">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<h2>Interests</h2>
					<span className={styles.meta}>things I think about</span>
				</div>
				<div className={styles.constellation}>
					<svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.constellationSvg}
						onPointerDown={(event) => {
							drag.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
							event.currentTarget.setPointerCapture(event.pointerId);
						}}
						onPointerMove={(event) => {
							if (!drag.current || drag.current.pointerId !== event.pointerId) return;
							const deltaX = event.clientX - drag.current.x;
							const deltaY = event.clientY - drag.current.y;
							drag.current.x = event.clientX;
							drag.current.y = event.clientY;
							setAngle((value) => value + deltaX * 0.008);
							setTilt((value) => value + deltaY * 0.008);
						}}
						onPointerUp={() => { drag.current = null; }}
						onPointerCancel={() => { drag.current = null; }}
						onLostPointerCapture={() => { drag.current = null; }}
						 role="img" aria-label="A rotating globe of connected interests">
						<defs>
							<radialGradient id="interest-glow"><stop stopColor="#a8ffc1" stopOpacity=".55" /><stop offset="1" stopColor="#a8ffc1" stopOpacity="0" /></radialGradient>
						</defs>
						{Array.from({ length: 80 }, (_, i) => (
							<circle key={`star-${i}`} className={styles.star} cx={30 + ((i * 137.5) % 700)} cy={25 + ((i * 97.3 + angle * (8 + i % 12)) % 710)} r={i % 13 === 0 ? 1.5 : i % 4 === 0 ? 1 : 0.6} fill="#fff" style={{ animationDelay: `${-(i % 11) * 0.6}s`, animationDuration: `${2.5 + (i % 7) * 0.7}s` }} />
						))}
						{edges.map(([a, b]) => {
							const start = projected[a];
							const end = projected[b];
							if (!start || !end) return null;
							const active = hovered === a || hovered === b;
							const opacity = active ? 0.65 : 0.09 + ((start.depth + end.depth + 2) / 4) * 0.19;
							return <path key={`${a}-${b}`} d={`M ${start.px} ${start.py} Q ${(start.px + end.px) / 2 + (CENTER - (start.px + end.px) / 2) * 0.12} ${(start.py + end.py) / 2 + (CENTER - (start.py + end.py) / 2) * 0.12} ${end.px} ${end.py}`} fill="none" stroke={active ? colors[points[a].group] : "#a5cdb0"} strokeWidth={active ? 1.3 : 0.8} opacity={opacity} />;
						})}
						{projected.map((point, index) => {
							const active = hovered === index;
							const opacity = active ? 1 : 0.55 + (point.depth + 1) * 0.225;
							const r = (point.hub ? 7.5 : index % 5 === 0 ? 5 : 4) * (0.8 + (point.depth + 1) * 0.13);
							return (
								<g key={point.label} opacity={opacity} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}>
									<circle cx={point.px} cy={point.py} r={r * 4} fill="url(#interest-glow)" opacity={active ? 0.8 : 0.35} />
									<circle cx={point.px} cy={point.py} r={r} fill={colors[point.group]} />
									<circle cx={point.px} cy={point.py} r="13" fill="transparent" />
									<text x={point.px + r + 6} y={point.py + 3} className={styles.label} fill={active ? "#fff" : "#d7e5dc"} fontSize={point.hub ? 11 : 9}>{point.label}</text>
								</g>
							);
						})}
					</svg>
					<div className={styles.legend}>
						<span><i style={{ background: colors.core }} /> ENGINEERING</span>
						<span><i style={{ background: colors.lang }} /> languages</span>
						<span><i style={{ background: colors.life }} /> OFF THE CLOCK</span>
					</div>
				</div>
			</div>
		</section>
	);
}
