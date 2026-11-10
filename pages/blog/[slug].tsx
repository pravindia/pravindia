import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getPostSlugs, getPostBySlug } from '../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote';
import MDXComponents from '../../components/Blog/MDXComponents';
import styles from '../../styles/Blog.module.scss';
import CoverImage from '../../components/Blog/CoverImage';
import { siteUrl } from '../../lib/developers';

export default function Post({ post }: any) {
	return (
		<>
			<Head>
				<title>{post.frontmatter.title} — Pravin Kumar</title>
				<meta name="description" content={post.frontmatter.excerpt || ''} />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={post.frontmatter.title} />
				<meta property="og:description" content={post.frontmatter.excerpt || ''} />
				{post.frontmatter.coverImage && <meta property="og:image" content={post.frontmatter.coverImage.startsWith('http') ? post.frontmatter.coverImage : `${siteUrl}${post.frontmatter.coverImage}`} />}
				<link rel="alternate" type="application/rss+xml" title="Pravin Kumar Blog" href="/api/rss.xml" />
			</Head>
			<Header />
			<main className={styles.articlePage}>
				<h1>{post.frontmatter.title}</h1>
				<p className={styles.articleExcerpt}>{post.frontmatter.excerpt}</p>
				{post.frontmatter.coverImage && <CoverImage src={post.frontmatter.coverImage} alt={post.frontmatter.coverAlt || ''} variant="article" />}
				<article className={styles.articleBody}>
					<MDXRemote {...post.mdxSource} components={MDXComponents} />
				</article>
			</main>
			<Footer textEnter={() => { }} textLeave={() => { }} />
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const slugs = await getPostSlugs();
	const paths = slugs.map((s: string) => ({ params: { slug: s.replace(/\.mdx?$/, '') } }));
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const slug = (params?.slug as string) || '';
	const post = await getPostBySlug(slug);
	return {
		props: { post },
		revalidate: 3600, // ISR: regenerate every hour on Vercel
	};
};
