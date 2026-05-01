import { useState, useEffect, useRef } from "react";
import { useCommandPalette } from "../../lib/CommandPaletteContext";
import styles from "./CommandPalette.module.scss";

interface Command {
	id: string;
	title: string;
	description?: string;
	category: "navigation" | "project" | "link" | "blog";
	action: () => void;
	icon?: string;
}

const commands: Command[] = [
	{
		id: "home",
		title: "Home",
		category: "navigation",
		icon: "🏠",
		action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
	},
	{
		id: "blog",
		title: "Blog",
		description: "Read my writings on web dev and AI",
		category: "navigation",
		icon: "📖",
		action: () => window.location.href = "/blog",
	},
	{
		id: "deno-post",
		title: "Deno: What's Different from Node.js",
		description: "Deno vs Node.js comparison",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/deno-whats-different-from-nodejs", "_blank"),
	},
	{
		id: "mongodb-post",
		title: "Learn What's MongoDB NoSQL",
		description: "MongoDB and NoSQL concepts",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/learn-whats-MongoDB-NoSQL", "_blank"),
	},
	{
		id: "flutter-when-not-post",
		title: "When Not to Use Flutter",
		description: "Flutter trade-offs and alternatives",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/When-not-to-use-Flutter", "_blank"),
	},
	{
		id: "glassmorphism-post",
		title: "Implement Glassmorphism in Your Flutter App",
		description: "Modern glassmorphism UI design",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/Implement-glassmorphism-in-your-flutter-app", "_blank"),
	},
	{
		id: "tailwind-post",
		title: "Try Tailwind CSS Today: Beginner Guide",
		description: "Utility-first CSS framework guide",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/try-tailwindcss-today-beginner-guide", "_blank"),
	},
	{
		id: "css-post",
		title: "Awesome CSS Pseudo Class and Functions",
		description: "Modern CSS techniques",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/awesome-css-pseudo-class-and-functions", "_blank"),
	},
	{
		id: "cicd-flutter-post",
		title: "CI/CD for Flutter",
		description: "Flutter pipeline setup",
		category: "blog",
		icon: "📝",
		action: () => window.open("https://smazee.com/blog/ci-cd-for-flutter", "_blank"),
	},
	{
		id: "works",
		title: "Works",
		description: "View my projects and work",
		category: "navigation",
		icon: "💼",
		action: () => {
			const element = document.getElementById("works");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "learning",
		title: "Learning",
		description: "What I'm exploring and learning",
		category: "navigation",
		icon: "📚",
		action: () => {
			const element = document.getElementById("learning");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "customs",
		title: "Customs Clearance System",
		description: "Netherlands • Backend Services",
		category: "project",
		icon: "📋",
		action: () => {
			const element = document.getElementById("works");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "warehouse",
		title: "Warehouse Management System",
		description: "Production • Microservices",
		category: "project",
		icon: "📦",
		action: () => {
			const element = document.getElementById("works");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "ecommerce",
		title: "B2B E-Commerce Platform",
		description: "Full Stack • Cross-platform",
		category: "project",
		icon: "🛍️",
		action: () => {
			const element = document.getElementById("works");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "ai",
		title: "AI-Enabled Backend Integrations",
		description: "RAG • MCP • Production",
		category: "project",
		icon: "🤖",
		action: () => {
			const element = document.getElementById("works");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "elearning",
		title: "E-Learning Platform",
		description: "Full Stack • Django • React",
		category: "project",
		icon: "📚",
		action: () => {
			const element = document.getElementById("works");
			element?.scrollIntoView({ behavior: "smooth" });
		},
	},
	{
		id: "resume",
		title: "Resume",
		description: "Download my CV",
		category: "link",
		icon: "📄",
		action: () => {
			window.open(
				"https://drive.google.com/file/d/1i1xcgy1VaEw1n1eI4p9JeZ2hJDLsw17K/view?usp=sharing",
				"_blank"
			);
		},
	},
];

export default function CommandPalette() {
	const { isOpen, openPalette, closePalette } = useCommandPalette();
	const [search, setSearch] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const filtered = commands.filter(
		(cmd) =>
			cmd.title.toLowerCase().includes(search.toLowerCase()) ||
			cmd.description?.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				openPalette();
				setSearch("");
				setSelectedIndex(0);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [openPalette]);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	const handleSelect = (cmd: Command) => {
		cmd.action();
		closePalette();
		setSearch("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((i) => (i + 1) % filtered.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (filtered[selectedIndex]) {
				handleSelect(filtered[selectedIndex]);
			}
		} else if (e.key === "Escape") {
			closePalette();
		}
	};

	return (
		<>
			{isOpen && (
				<>
					<div className={styles.backdrop} onClick={closePalette} />
					<div className={styles.container}>
						<div className={styles.inputWrapper}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
							<input
								ref={inputRef}
								type="text"
								placeholder="Search commands, projects, or navigate..."
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setSelectedIndex(0);
								}}
								onKeyDown={handleKeyDown}
								className={styles.input}
							/>
							{search && (
								<button
									className={styles.clearBtn}
									onClick={() => {
										setSearch("");
										setSelectedIndex(0);
									}}
									aria-label="Clear search"
								>
									×
								</button>
							)}
						</div>

						<div className={styles.results}>
							{filtered.length === 0 ? (
								<div className={styles.empty}>
									<p>No commands found</p>
									<span>Try searching for "blog", "deno", "flutter", or a project name</span>
								</div>
							) : (
								<>
									{filtered.map((cmd, idx) => (
										<button
											key={cmd.id}
											className={`${styles.item} ${idx === selectedIndex ? styles.selected : ""}`}
											onClick={() => handleSelect(cmd)}
											onMouseEnter={() => setSelectedIndex(idx)}
										>
											<div className={styles.itemContent}>
												{cmd.icon && <span className={styles.icon}>{cmd.icon}</span>}
												<div className={styles.text}>
													<div className={styles.title}>{cmd.title}</div>
													{cmd.description && <div className={styles.description}>{cmd.description}</div>}
												</div>
											</div>
											<span className={styles.category}>{cmd.category}</span>
										</button>
									))}
								</>
							)}
						</div>

						<div className={styles.footer}>
							<span>
								<kbd>↑↓</kbd> Navigate
							</span>
							<span>
								<kbd>Enter</kbd> Select
							</span>
							<span>
								<kbd>Esc</kbd> Close
							</span>
						</div>
					</div>
				</>
			)}
		</>
	);
}
