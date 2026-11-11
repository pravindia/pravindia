export const articleCategories = [
  { id: "tutorials-how-tos", label: "Tutorials & How-Tos", description: "Step-by-step technical guides, troubleshooting walkthroughs, and code snippets." },
  { id: "system-design-architecture", label: "System Design & Architecture", description: "Deep dives into scalability, databases, API design, and building robust backends." },
  { id: "emerging-tech-ai", label: "Emerging Tech & AI", description: "Exploring new developer tools, automation, AI integration, and futuristic tech." },
  { id: "career-productivity", label: "Career & Productivity", description: "Tips for developers, coding workflows, time management, and professional growth." },
] as const;

export type ArticleCategory = typeof articleCategories[number]['id'];

export function getArticleCategory(value: unknown) {
  const category = articleCategories.find(category => category.id === value);
  if (!category) throw new Error(`Unknown article category: ${String(value)}`);
  return category;
}
