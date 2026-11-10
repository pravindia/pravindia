import Image from 'next/image';
import styles from './CoverImage.module.scss';

interface CoverImageProps {
	src: string;
	alt: string;
	variant?: 'feature' | 'card' | 'article';
}

export default function CoverImage({ src, alt, variant = 'article' }: CoverImageProps) {
	return (
		<div className={`${styles.cover} ${styles[variant]}`}>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={variant === 'card' ? '(max-width: 640px) 96px, 144px' : '(max-width: 860px) 100vw, 840px'}
				loading="lazy"
				decoding="async"
				unoptimized={process.env.NODE_ENV === 'development' && src.startsWith('https://')}
				/>
		</div>
	);
}
