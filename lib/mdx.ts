import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

const POSTS_PATH = path.join(process.cwd(), 'posts');

export async function getPostSlugs() {
	if (!fs.existsSync(POSTS_PATH)) return [];
	return fs.readdirSync(POSTS_PATH).filter((f) => f.endsWith('.mdx'));
}

export async function getPostBySlug(slug: string) {
	const realSlug = slug.replace(/\.mdx?$/, '');
	const fullPath = path.join(POSTS_PATH, `${realSlug}.mdx`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);
	const mdxSource = await serialize(content, { scope: data });
	return {
		slug: realSlug,
		frontmatter: data,
		mdxSource,
	};
}

export async function getAllPosts() {
	const slugs = await getPostSlugs();
	return Promise.all(
		slugs.map(async (s) => {
			const { frontmatter } = await getPostBySlug(s);
			return { slug: s.replace(/\.mdx?$/, ''), ...frontmatter };
		})
	);
}
