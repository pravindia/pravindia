import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styles from './PageTransition.module.scss';

type PageTransitionProps = {
	children: ReactNode;
	routeKey: string;
};

export default function PageTransition({ children, routeKey }: PageTransitionProps) {
	const reduceMotion = useReducedMotion();
	const [isHydrated, setIsHydrated] = useState(false);
	const easing = [0.76, 0, 0.24, 1] as const;
	const coverTransition = { duration: reduceMotion ? 0 : 0.517, ease: easing };
	const revealTransition = { duration: reduceMotion ? 0 : 0.604, ease: easing };

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) return <>{children}</>;

	return (
		<div className={styles.frame}>
			<AnimatePresence initial={false} mode="wait">
				<motion.div
					key={routeKey}
					className={styles.page}
					initial="enter"
					animate="visible"
					exit="exit"
				>
					{children}
					<motion.div
						className={styles.curtain}
						aria-hidden="true"
						variants={reduceMotion ? {
							enter: { opacity: 0 }, visible: { opacity: 0 }, exit: { opacity: 0 },
						} : {
							enter: { y: '0%' }, visible: { y: '100%' }, exit: { y: '100%' },
						}}
						transition={revealTransition}
					/>
					<motion.div
						className={styles.curtain}
						aria-hidden="true"
						variants={reduceMotion ? {
							enter: { opacity: 0 }, visible: { opacity: 0 }, exit: { opacity: 0 },
						} : {
							enter: { y: '-100%' }, visible: { y: '-100%' }, exit: { y: '0%' },
						}}
						transition={coverTransition}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
