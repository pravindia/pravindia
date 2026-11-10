export interface ExternalArticle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  kind: "blog" | "insights" | "case-study";
  url: string;
  coverImage?: string;
  coverAlt?: string;
}

export const externalArticles: ExternalArticle[] = [
	{
		slug: "ci-cd-for-flutter",
		title: "CI/CD for Flutter",
		date: "2024",
		excerpt: "Set up a practical CI/CD pipeline for Flutter apps — from first commit to release build. Covers GitHub Actions, test runners, and artifact signing without the usual boilerplate tax.",
		tags: ["Flutter", "CI/CD", "DevOps"],
		readTime: "8 min",
		kind: "blog",
		url: "https://smazee.com/blog/ci-cd-for-flutter",
	},
	{
		slug: "deno-whats-different-from-nodejs",
		title: "Deno: What's Different from Node.js",
		date: "2024",
		excerpt: "A practical comparison of Deno vs Node.js — module resolution, permissions model, and when it's worth the switch.",
		tags: ["Deno", "Node.js", "JavaScript"],
		readTime: "6 min",
		kind: "blog",
		url: "https://smazee.com/blog/deno-whats-different-from-nodejs",
	},
	{
		slug: "learn-whats-MongoDB-NoSQL",
		title: "Learn What's MongoDB & NoSQL",
		date: "2024",
		excerpt: "A beginner-friendly walkthrough of MongoDB, documents, collections, and the core ideas behind NoSQL data modelling.",
		tags: ["MongoDB", "NoSQL", "Databases"],
		readTime: "5 min",
		kind: "insights",
		url: "https://smazee.com/blog/learn-whats-MongoDB-NoSQL",
		coverImage: "https://miro.medium.com/v2/resize:fit:2000/format:webp/1*plTQEOtbHS3qAr_pz24E4Q.jpeg",
		coverAlt: "Illustration of NoSQL databases and connected data servers",
	},
	{
		slug: "When-not-to-use-Flutter",
		title: "When Not to Use Flutter",
		date: "2023",
		excerpt: "Scenarios where Flutter is a poor fit, the real trade-offs, and what to reach for instead.",
		tags: ["Flutter", "Mobile", "Architecture"],
		readTime: "7 min",
		kind: "blog",
		url: "https://smazee.com/blog/When-not-to-use-Flutter",
		coverImage: "https://smazee.com/uploads/blog/When-not-to-use-Flutter.png",
	},
	{
		slug: "Implement-glassmorphism-in-your-flutter-app",
		title: "Implement Glassmorphism in Flutter",
		date: "2023",
		excerpt: "How we took a design concept from Figma to a production Flutter app — BlurFilter trade-offs, performance on mid-range Android, and the implementation decisions we'd change.",
		tags: ["Flutter", "UI", "Design"],
		readTime: "6 min",
		kind: "case-study",
		url: "https://smazee.com/blog/Implement-glassmorphism-in-your-flutter-app",
	},
	{
		slug: "try-tailwindcss-today-beginner-guide",
		title: "Try Tailwind CSS Today",
		date: "2023",
		excerpt: "Get moving fast with Tailwind and actually understand utility-first styling instead of just copying class names.",
		tags: ["Tailwind", "CSS", "Frontend"],
		readTime: "5 min",
		kind: "blog",
		url: "https://smazee.com/blog/try-tailwindcss-today-beginner-guide",
	},
	{
		slug: "awesome-css-pseudo-class-and-functions",
		title: "CSS Pseudo-Classes & Functions Worth Knowing",
		date: "2023",
		excerpt: "The most useful pseudo-classes and modern CSS functions that let you write dramatically less code.",
		tags: ["CSS", "Frontend"],
		readTime: "4 min",
		kind: "insights",
		url: "https://smazee.com/blog/awesome-css-pseudo-class-and-functions",
	},
];
