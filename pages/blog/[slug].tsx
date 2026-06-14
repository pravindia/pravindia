import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getPostSlugs, getPostBySlug } from '../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote';
import MDXComponents from '../../components/Blog/MDXComponents';
import styles from '../../styles/WorkDetail.module.scss';

export default function Post({ post }: any) {
	return (
		<>
			<Head>
				<title>{post.frontmatter.title} — Pravin Kumar</title>
				<link rel="alternate" type="application/rss+xml" title="Pravin Kumar Blog" href="/api/rss.xml" />
			</Head>
			<Header />
			<main style={{ maxWidth: 840, margin: '6rem auto 3rem', padding: '0 1rem' }}>
				<h1>{post.frontmatter.title}</h1>
				<p>{post.frontmatter.excerpt}</p>
				<article>
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
