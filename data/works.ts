export type WorkItem = {
	slug: string;
	title: string;
	status: "live" | "wip";
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
		slug: "customs-clearance-system-netherlands",
		title: "Customs Clearance System (Netherlands)",
		status: "live",
		period: "2023 — Present",
		role: "Senior Software Specialist | Tech Lead",
		summary: "NestJS + Python microservices for customs workflows, VPN communication, and AI-assisted HS code recommendations.",
		description:
			"Built and maintained backend services for a large-scale Dutch import customs clearance platform. Delivered secure IPSec VPN communication with customs systems, integrated DMS/DECO workflows, and introduced AI-assisted product classification using embeddings and similarity search.",
		highlights: [
			"Developed backend services with NestJS, Python microservices, and Angular-integrated workflows",
			"Integrated secure IPSec VPN communication for customs data exchange",
			"Built AI-assisted HS code recommendations using embeddings and similarity search",
		],
		tech: ["NestJS", "TypeScript", "Python", "Angular", "IPSec VPN", "LLM Embeddings"],
		link: null,
		github: null,
	},
	{
		slug: "warehouse-management-system",
		title: "Warehouse Management System",
		status: "live",
		period: "2023 — Present",
		role: "Tech Lead",
		summary: "Production-grade warehouse platform with barcode scanning, OCR automation, real-time workflows, and backend infra ownership.",
		description:
			"Led the backend team from project initiation to production, owning architecture, deployments, server configuration, load balancing, and database replication. Built high-performance APIs for parcel scanning, OCR-driven document pipelines, and real-time event workflows.",
		highlights: [
			"Led backend architecture, CI/CD, infra, load balancing, and replication strategy",
			"Built barcode scanning and shipment retrieval APIs using Redis and read replicas",
			"Implemented OCR-based extraction for NOA, T1, and TTL documents",
		],
		tech: ["Node.js", "FastAPI", "MySQL", "Redis", "Socket.IO", "Firebase", "Typesense", "Docker"],
		link: null,
		github: null,
	},
	{
		slug: "b2b-ecommerce-platform",
		title: "B2B E-Commerce Platform",
		status: "live",
		period: "2023 — Present",
		role: "Backend / App Engineer",
		summary: "FastAPI backend services, Flutter apps across Android/iOS/Web, and operational dashboards for sorting workflows.",
		description:
			"Developed backend services to power inbound and parcel sorting operations, integrating external third-party systems via SOAP APIs. Built Flutter apps across platforms and supported Node.js admin applications for operational management and analytics.",
		highlights: [
			"Developed FastAPI services for inbound and parcel sorting workflows",
			"Integrated external enterprise systems via SOAP APIs",
			"Built Flutter apps for Android, iOS, and Web alongside admin tooling",
		],
		tech: ["FastAPI", "Flutter", "Node.js", "SOAP APIs", "Analytics Dashboards"],
		link: null,
		github: null,
	},
	{
		slug: "ai-enabled-backend-integrations",
		title: "AI-Enabled Backend Integrations",
		status: "wip",
		period: "Ongoing",
		role: "AI Systems Exploration",
		summary: "Production-oriented OCR, RAG, MCP, and retrieval-driven backend automations for operational workflows.",
		description:
			"Built and explored AI-enabled backend workflows including OCR extraction, context retrieval, MCP integrations, and retrieval-augmented flows for faster operations and better decision support in production-like systems.",
		highlights: [
			"Applied OCR pipelines for structured extraction from operational documents",
			"Explored MCP and RAG-based integration patterns for internal tools",
			"Used Redis, Elasticsearch, and retrieval-driven flows for AI-assisted operations",
		],
		tech: ["RAG", "MCP", "Python", "Elasticsearch", "Redis", "Distributed Systems"],
		link: null,
		github: "https://github.com/pravindia",
	},
];

export function getWorkBySlug(slug: string) {
	return works.find((work) => work.slug === slug);
}