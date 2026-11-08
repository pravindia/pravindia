import { useEffect, useState } from "react";
import styles from "./GitHubGrid.module.scss";

const WEEKS = 53;
const DAYS = 7;
const TOTAL = WEEKS * DAYS;

type Cell = { level: number; delay: number; dur: number };

// Five-column pixel letters, separated by one column, fill the 53-week grid.
const LETTERS = [
	["00000", "11110", "10001", "10001", "11110", "10000", "10000"], // p
	["00000", "10110", "11001", "10000", "10000", "10000", "10000"], // r
	["00000", "01110", "00001", "01111", "10001", "01111", "00000"], // a
	["00000", "10001", "10001", "10001", "01010", "00100", "00000"], // v
	["00100", "00000", "01100", "00100", "00100", "01110", "00000"], // i
	["00000", "11110", "10001", "10001", "10001", "10001", "00000"], // n
	["00001", "00001", "01111", "10001", "10001", "01111", "00000"], // d
	["00100", "00000", "01100", "00100", "00100", "01110", "00000"], // i
	["00000", "01110", "00001", "01111", "10001", "01111", "00000"], // a
];

function isLetterCell(index: number) {
	const row = Math.floor(index / WEEKS);
	const column = index % WEEKS;
	const letter = Math.floor(column / 6);
	const letterColumn = column % 6;
	return letterColumn < 5 && LETTERS[letter]?.[row][letterColumn] === "1";
}


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
				for (let i = 0; i < 16; i++) {
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
			<div className={styles.grid} data-variant="section" role="img" aria-label="pravindia in an animated contribution grid">
				{cells.map((cell, i) => (
					<div
						key={i}
						className={styles.cell}
						data-level={isLetterCell(i) ? (cell.level >= 3 ? 4 : 3) : (cell.level === 4 ? 2 : 0)}
						style={{ animationDelay: `${cell.delay}s`, animationDuration: `${cell.dur}s` }}
					/>
				))}
			</div>
		</div>
	);
}
