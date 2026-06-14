import React from 'react';
// Use plain <img> in MDX to avoid next/image SSR/CSR markup differences
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const CodeBlock: React.FC<{ children: string; className?: string }> = ({ children, className }) => {
	const match = /language-(\w+)/.exec(className || '');
	const lang = match ? match[1] : '';
	return (
		<>
			<SyntaxHighlighter language={lang} style={tomorrow} >
				{String(children).replace(/\n$/, '')}
			</SyntaxHighlighter>
		</>
	);
};

export const YouTube: React.FC<{ id: string; title?: string }> = ({ id, title }) => (
	<>
		<div style={{ position: 'relative', paddingTop: '56.25%', margin: '1rem 0' }}>
			<iframe
				src={`https://www.youtube.com/embed/${id}`}
				title={title || 'YouTube video'}
				style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				loading="lazy"
			/>
		</div>
	</>
);

export const MDXImage: React.FC<any> = (props) => {
	const { src, alt, width, height } = props;
	// normalize public paths: allow authors to write /public/... or /...
	let out = src || '';
	if (out.startsWith('/public/')) out = out.replace(/^\/public\//, '/');
	return (
		<>
			<img
				src={out}
				alt={alt || ''}
				width={width}
				height={height}
				style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '1rem 0' }}
				decoding="async"
				loading="lazy"
			/>
		</>
	);
};

const MDXComponents = {
	pre: (props: any) => <div {...props} />, // handled by CodeBlock
	code: (props: any) => <CodeBlock {...props} />,
	img: (props: any) => <MDXImage {...props} />,
	YouTube,
};

export default MDXComponents;
