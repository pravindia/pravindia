import type { NextApiRequest, NextApiResponse } from 'next';
import { developerProfile } from '../../../lib/developers';
import { getDeveloperPosts, getDeveloperProjects } from '../../../lib/developer-content';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Allow', 'GET, HEAD, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: { code: 'method_not_allowed', message: 'Use GET or HEAD to read this resource.' } });
  try {
    let data;
    switch (req.query.resource) {
      case 'profile': data = developerProfile; break;
      case 'projects': data = getDeveloperProjects(); break;
      case 'posts': data = getDeveloperPosts(); break;
      default: return res.status(404).json({ error: { code: 'not_found', message: 'Unknown resource.' } });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({ data });
  } catch {
    return res.status(500).json({ error: { code: 'internal_error', message: 'Could not load this resource.' } });
  }
}
