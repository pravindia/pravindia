import type { NextApiRequest, NextApiResponse } from 'next';
import { getDeveloperGuide, getLlmContext, getOpenApi, getSitemap } from '../../../lib/developer-content';
import { siteUrl } from '../../../lib/developers';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Allow', 'GET, HEAD');
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: { code: 'method_not_allowed', message: 'Use GET or HEAD.' } });
  const files: Record<string, { type: string; read: () => string }> = {
    'llms.txt': { type: 'text/plain', read: getLlmContext },
    'developers.md': { type: 'text/markdown', read: getDeveloperGuide },
    'openapi.json': { type: 'application/json', read: () => JSON.stringify(getOpenApi(), null, 2) },
    'sitemap.xml': { type: 'application/xml', read: getSitemap },
    'robots.txt': { type: 'text/plain', read: () => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` },
  };
  const file = typeof req.query.file === 'string' && Object.prototype.hasOwnProperty.call(files, req.query.file) ? files[req.query.file] : undefined;
  if (!file) return res.status(404).json({ error: { code: 'not_found', message: 'Unknown resource.' } });
  try {
    const content = file.read();
    res.setHeader('Content-Type', `${file.type}; charset=utf-8`);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(content);
  } catch {
    return res.status(500).json({ error: { code: 'internal_error', message: 'Could not load this resource.' } });
  }
}
