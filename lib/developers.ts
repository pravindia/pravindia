export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pravindia.com').replace(/\/$/, '');

export const developerProfile = {
  name: 'Pravin Kumar',
  username: 'pravindia',
  role: 'Senior Software Developer',
  bio: 'Engineer, developer, and startup builder focused on backend architecture, distributed systems, and applied AI.',
  skills: ['TypeScript', 'Python', 'Node.js', 'NestJS', 'FastAPI', 'Next.js', 'Angular', 'Flutter', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'RAG', 'MCP', 'LLMOps'],
  links: {
    website: siteUrl,
    github: 'https://github.com/pravindia',
    linkedin: 'https://www.linkedin.com/in/pravindia',
    codepen: 'https://codepen.io/pravindia',
  },
};

export const endpointGroups = [
  { title: 'Read', description: 'A little context goes a long way.', endpoints: [
    { path: '/llms.txt', format: 'TEXT', description: 'Start here. My background, skills, and links for your agent.' },
    { path: '/api/v1/profile', format: 'JSON', description: 'My profile and the technologies I work with.' },
    { path: '/developers.md', format: 'MD', description: 'This developer guide, as plain Markdown.' },
  ] },
  { title: 'Explore', description: 'The things I build and write about.', endpoints: [
    { path: '/api/v1/projects', format: 'JSON', description: 'Projects, case studies, stacks, and engineering highlights.' },
    { path: '/api/v1/posts', format: 'JSON', description: 'Published blog metadata and canonical article links.' },
    { path: '/api/rss.xml', format: 'RSS', description: 'Subscribe to new writing in your favorite feed reader.' },
  ] },
  { title: 'Discover', description: 'Find your way around the site.', endpoints: [
    { path: '/openapi.json', format: 'JSON', description: 'An OpenAPI 3.1 description of the public JSON API.' },
    { path: '/sitemap.xml', format: 'XML', description: 'The homepage, writing, projects, and this guide.' },
  ] },
];

export const agentPrompt = `Read ${siteUrl}/llms.txt and ${siteUrl}/openapi.json. Introduce me to Pravin Kumar's engineering background, explore his projects, and show me a curl request to read his public API. Cite the source URLs.`;
