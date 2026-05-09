import Link from 'next/link'
import { useCommandPalette } from '../../lib/CommandPaletteContext'
import { useState, useEffect } from 'react'

import styles from './Header.module.scss'

const Header = () => {
	const { openPalette } = useCommandPalette();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<div className={`${styles.headerWrap} ${scrolled ? styles.scrolled : ''}`}>
			<header className={styles.header}>
				<Link href="/" className={styles.brand}>
					pravindia<span className={styles.blinker}>_</span>
				</Link>

				<nav className={styles.navList}>
					<ul>
						<li><Link href="/#works"><span className={styles.hash}>/</span>works</Link></li>
						<li><Link href="/blog"><span className={styles.hash}>/</span>writing</Link></li>
					</ul>
				</nav>

				<div className={styles.actions}>
					<a className={styles.openToWork} href="https://www.linkedin.com/in/pravindia" target="_blank" rel="noreferrer">
						<span className={styles.otwDot} />
						<div className={styles.otwText}>
							<div className={styles.otwLine}>
								{/* <span style={{color:'var(--green)'}}>●</span> */}
								<span>Open to work</span>
							</div>
							{/* <div className={styles.otwSub}>staff & senior · backend / platform</div> */}
						</div>
					</a>
					<button
						className={styles.searchBar}
						onClick={openPalette}
						aria-label="Open search"
						title="Press ⌘K or Ctrl+K"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="11" cy="11" r="7" />
							<path d="m21 21-4.3-4.3" />
						</svg>
						<span>Search…</span>
						<span className={styles.kbdPair}><span className={styles.kbd}>⌘</span><span className={styles.kbd}>K</span></span>
					</button>
				</div>
			</header>
		</div>
	);
}

export default Header;