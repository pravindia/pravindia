import { useEffect, useState } from "react";
import styles from "./GitHubGrid.module.scss";

const WEEKS = 53;
const DAYS = 7;
const TOTAL = WEEKS * DAYS;

type Cell = { level: number; delay: number; dur: number };

function randomLevel() {
	const r = Math.random();
	if (r < 0.45) return 0;
	if (r < 0.65) return 1;
	if (r < 0.8) return 2;
	if (r < 0.92) return 3;
	return 4;
}

function makeGrid(): Cell[] {
	return Array.from({ length: TOTAL }, () => ({
		level: randomLevel(),
		delay: Math.random() * 6,
		dur: 2 + Math.random() * 5,
	}));
}

function getRollingMonths() {
	const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
	const now = new Date();

	return Array.from({ length: 12 }, (_, index) => {
		const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
		return formatter.format(date);
	});
}

export default function GitHubGrid({ variant = "bg" }: { variant?: "bg" | "section" }) {
	const [cells, setCells] = useState<Cell[]>([]);

	useEffect(() => {
		setCells(makeGrid());

		const interval = setInterval(() => {
			setCells((prev) => {
				const next = [...prev];
				for (let i = 0; i < 8; i++) {
					const idx = Math.floor(Math.random() * TOTAL);
					next[idx] = { ...next[idx], level: randomLevel() };
				}
				return next;
			});
		}, 600);

		return () => clearInterval(interval);
	}, []);

	if (variant === "bg") {
		return (
			<div className={styles.bgContainer} aria-hidden="true">
				<div className={styles.grid}>
					{cells.map((cell, i) => (
						<div
							key={i}
							className={styles.cell}
							data-level={cell.level}
							style={{ animationDelay: `${cell.delay}s`, animationDuration: `${cell.dur}s` }}
						/>
					))}
				</div>
			</div>
		);
	}

	// Section variant — labeled calendar view
	const months = getRollingMonths();

	return (
		<div className={styles.sectionContainer}>
			<div className={styles.monthLabels}>
				{months.map((m) => (
					<span key={m}>{m}</span>
				))}
			</div>
			<div className={styles.grid} data-variant="section">
				{cells.map((cell, i) => (
					<div
						key={i}
						className={styles.cell}
						data-level={cell.level}
						title={`${cell.level > 0 ? cell.level : "No"} contribution${cell.level !== 1 ? "s" : ""}`}
						style={{ animationDelay: `${cell.delay}s`, animationDuration: `${cell.dur}s` }}
					/>
				))}
			</div>
		</div>
	);
}
