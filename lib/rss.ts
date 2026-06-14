import { getAllPosts } from './mdx';

export async function generateRSSFeed(siteUrl: string) {
	const posts = await getAllPosts();

	// Sort posts by date, newest first
	const sortedPosts = posts.sort((a: any, b: any) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const rssItems = sortedPosts
		.map((post: any) => {
			const postUrl = `${siteUrl}/blog/${post.slug}`;
			const pubDate = new Date(post.date).toUTCString();
			return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || '')}</description>
      <category>${escapeXml((post.tags && post.tags[0]) || 'blog')}</category>
    </item>`;
		})
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Pravin Kumar - Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Tech blogs, tutorials, and short takes on frontend, mobile, AI, Claude, system design, and the craft of building things.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${siteUrl}/assets/img/logo.png</url>
      <title>Pravin Kumar</title>
      <link>${siteUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`;

	return rss;
}

function escapeXml(str: string): string {
	if (!str) return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
