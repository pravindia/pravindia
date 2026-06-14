import { NextApiRequest, NextApiResponse } from 'next';
import { generateRSSFeed } from '../../lib/rss';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pravindia.com';
		const feed = await generateRSSFeed(siteUrl);

		res.setHeader('Content-Type', 'application/xml; charset=utf-8');
		res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
		res.status(200).send(feed);
	} catch (error) {
		console.error('RSS generation error:', error);
		res.status(500).send('Error generating RSS feed');
	}
}
