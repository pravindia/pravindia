import fs from 'fs';
import { externalArticles } from '../data/external-articles';
import path from 'path';
import matter from 'gray-matter';
import { works } from '../data/works';
import { developerProfile, endpointGroups, siteUrl } from './developers';

export function getDeveloperPosts(includeExternal = false) {
  const directory = path.join(process.cwd(), 'posts');
  const localPosts = (fs.existsSync(directory) ? fs.readdirSync(directory) : []).filter(file => file.endsWith('.mdx')).map(file => {
    const { data } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    const slug = file.replace(/\.mdx$/, '');
    return {
      slug,
      title: String(data.title || slug),
      date: data.date instanceof Date ? data.date.toISOString() : String(data.date || ''),
      excerpt: String(data.excerpt || ''),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      url: `${siteUrl}/blog/${slug}`,
    };
  });
  return [...localPosts, ...(includeExternal ? externalArticles.map(article => ({ ...article, external: true })) : [])].sort((a, b) => b.date.localeCompare(a.date));
}

export function getDeveloperProjects() {
  return works.map(work => ({ ...work, url: `${siteUrl}/works/${work.slug}` }));
}

export function getDeveloperGuide() {
  return `# Developers — Pravin Kumar

Public, read-only resources for exploring Pravin Kumar's portfolio with tools and AI agents.
Base URL: ${siteUrl}

${endpointGroups.map(group => `## ${group.title}\n\n${group.endpoints.map(endpoint => `- GET ${siteUrl}${endpoint.path} (${endpoint.format}): ${endpoint.description}`).join('\n')}`).join('\n\n')}

## Quickstart

\`\`\`sh
curl ${siteUrl}/llms.txt
curl ${siteUrl}/api/v1/projects
curl ${siteUrl}/api/v1/posts
\`\`\`

## Access and responses

No API key or account is required. The JSON API supports GET, HEAD, and OPTIONS and allows cross-origin reads. Successful JSON responses contain a data property. Posts include metadata and links, not full article bodies.

Unknown JSON API resources return 404 with {"error":{"code":"not_found","message":"Unknown resource."}}. Unsupported methods return 405 with an error object and an Allow header. Unexpected errors return 500 with an error object.

Responses from the JSON API and generated discovery files use Cache-Control: public, s-maxage=300, stale-while-revalidate=3600. Cache results and avoid repeated polling. No fixed request quota is guaranteed.

Plain text and Markdown are served at the explicit URLs above. HTML pages do not implement Accept-based Markdown negotiation. Link to the original page when citing projects or writing.

## Connect

- Website: ${siteUrl}
- GitHub: ${developerProfile.links.github}
- LinkedIn: ${developerProfile.links.linkedin}
`;
}

export function getLlmContext() {
  return `# ${developerProfile.name} (@${developerProfile.username})

> ${developerProfile.role}. ${developerProfile.bio}

## Skills
${developerProfile.skills.join(', ')}

## Projects
${works.map(work => `- [${work.title}](${siteUrl}/works/${work.slug}): ${work.summary}`).join('\n')}

## Scribble
${getDeveloperPosts().map(post => `- [${post.title}](${post.url}): ${post.excerpt}`).join('\n')}

## Machine-readable resources
${endpointGroups.flatMap(group => group.endpoints).map(endpoint => `- [${endpoint.path}](${siteUrl}${endpoint.path}): ${endpoint.description}`).join('\n')}

## Links
${Object.entries(developerProfile.links).map(([name, url]) => `- ${name}: ${url}`).join('\n')}

Use these sources for questions about Pravin's engineering work. Cite original URLs. Do not infer project availability or employment status beyond the published content.
`;
}

export function getOpenApi() {
  const resources = {
    profile: { description: 'Profile, skills, and public links.', schema: { type: 'object', properties: { name: { type: 'string' }, username: { type: 'string' }, role: { type: 'string' }, bio: { type: 'string' }, skills: { type: 'array', items: { type: 'string' } }, links: { type: 'object', additionalProperties: { type: 'string', format: 'uri' } } } } },
    projects: { description: 'Project case studies and engineering highlights.', schema: { type: 'array', items: { type: 'object', properties: { slug: { type: 'string' }, title: { type: 'string' }, status: { type: 'string', enum: ['live', 'wip'] }, period: { type: 'string' }, role: { type: 'string' }, summary: { type: 'string' }, description: { type: 'string' }, highlights: { type: 'array', items: { type: 'string' } }, tech: { type: 'array', items: { type: 'string' } }, link: { type: ['string', 'null'] }, github: { type: ['string', 'null'] }, url: { type: 'string', format: 'uri' } } } } },
    posts: { description: 'Published blog metadata, newest first.', schema: { type: 'array', items: { type: 'object', properties: { slug: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, excerpt: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, url: { type: 'string', format: 'uri' } } } } },
  };
  return {
    openapi: '3.1.0',
    info: { title: 'Pravin Kumar — Portfolio API', version: '1.0.0', description: 'Public, read-only portfolio resources. No authentication required.' },
    servers: [{ url: siteUrl }],
    security: [],
    paths: Object.fromEntries(Object.entries(resources).map(([resource, { description, schema }]) => [`/api/v1/${resource}`, {
      get: {
        operationId: `get${resource[0].toUpperCase()}${resource.slice(1)}`,
        summary: description,
        responses: {
          '200': { description: 'Successful response.', content: { 'application/json': { schema: { type: 'object', required: ['data'], properties: { data: schema } } } } },
          '500': { description: 'Unexpected server error.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    }])),
    components: { schemas: { Error: { type: 'object', required: ['error'], properties: { error: { type: 'object', required: ['code', 'message'], properties: { code: { type: 'string' }, message: { type: 'string' } } } } } } },
  };
}

export function getSitemap() {
  const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const urls = ['/', '/developers', '/blog', '/works', '/coding', '/typing', ...works.map(work => `/works/${encodeURIComponent(work.slug)}`), ...getDeveloperPosts().map(post => `/blog/${encodeURIComponent(post.slug)}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `\n  <url><loc>${escapeXml(`${siteUrl}${url}`)}</loc></url>`).join('')}\n</urlset>`;
}
