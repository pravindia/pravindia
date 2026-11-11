export type WorkItem = {
	slug: string;
	title: string;
	status: "completed";
	period: string;
	role: string;
	summary: string;
	description: string;
	highlights: string[];
	tech: string[];
	link: string | null;
	github: string | null;
};

export const works: WorkItem[] = [
	{
		slug: "ai-marketing-intelligence-platform",
		title: "AI Marketing Intelligence Platform",
		status: "completed",
		period: "Jun 2026 — Sept 2026",
		role: "Senior Product Engineer | Independent contractor",
		summary: "AI marketing intelligence platform with a reusable multi-model agent architecture, multimodal RAG, evaluation, observability, and cost controls.",
		description:
			"Architected a scalable AI marketing intelligence platform using NestJS, TypeScript, Next.js, and PostgreSQL. Built a reusable multi-model agent architecture with multimodal RAG, evaluation, observability, and resilient execution workflows.",
		highlights: [
			"Built multimodal RAG with LangChain, pgvector, hybrid retrieval, reranking, grounded citations, and human-in-the-loop controls, achieving 86% Recall@8 and 480 ms p95 retrieval latency",
			"Established LLMOps practices for automated evaluation, token and cost metering, observability, idempotent execution, and failure recovery",
			"Reduced p95 time-to-first-token from 3.1s to 2.4s and lowered average AI-run cost by 14%",
		],
		tech: ["NestJS", "TypeScript", "Next.js", "PostgreSQL", "pgvector", "LangChain", "RAG", "LLMOps"],
		link: null,
		github: null,
	},
	{
		slug: "customs-clearance-system-netherlands",
		title: "Customs Clearance System (Netherlands)",
		status: "completed",
		period: "Jan 2023 — May 2026",
		role: "Senior Software Specialist | Tech Lead",
		summary: "NestJS + Python microservices for customs workflows, VPN communication, and AI-assisted HS code recommendations.",
		description:
			"Built and maintained backend services for a large-scale Dutch import customs clearance platform, supporting DMS and DECO workflows that process 30K+ declarations daily. Delivered secure IPSec VPN communication and AI-assisted product classification using embeddings and similarity search.",
		highlights: [
			"Developed backend services with NestJS, Python microservices, and Angular-integrated workflows",
			"Integrated secure IPSec VPN communication for customs data exchange",
			"Built AI-assisted HS code recommendations using LLM embeddings and similarity search, reducing manual classification time by 80%",
			"Configured IPSec VPN and VPN-based email exchange for customs declaration submissions and responses",
		],
		tech: ["NestJS", "TypeScript", "Python", "Angular", "IPSec VPN", "LLM Embeddings"],
		link: null,
		github: null,
	},
	{
		slug: "warehouse-management-system",
		title: "Warehouse Management System",
		status: "completed",
		period: "Jan 2023 — May 2026",
		role: "Tech Lead",
		summary: "Production-grade warehouse platform with barcode scanning, OCR automation, real-time workflows, and backend infra ownership.",
		description:
			"Led a team of three engineers from project initiation to production, including architecture, CI/CD deployments, server configuration, load balancing, and database replication. Built APIs, OCR pipelines, and event-driven workflows for warehouse and parcel operations.",
		highlights: [
			"Led architecture, CI/CD, server configuration, load balancing, and replication, achieving 99.5% uptime",
			"Built barcode scanning APIs with Redis caching and read-replica optimization, achieving parcel retrieval latency below 80 ms",
			"Built OCR extraction for NOA, T1, and TTL documents, reducing manual processing time by about 70%",
			"Developed real-time communication and search with Socket.io, Firebase, Typesense, Redis, background workers, and event-driven workflows",
		],
		tech: ["Node.js", "FastAPI", "MySQL", "Redis", "Socket.IO", "Firebase", "Typesense", "Docker"],
		link: null,
		github: null,
	},
];

export function getWorkBySlug(slug: string) {
	return works.find((work) => work.slug === slug);
}
