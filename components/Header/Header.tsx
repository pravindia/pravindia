import Link from 'next/link'
import { useCommandPalette } from '../../lib/CommandPaletteContext'

import styles from './Header.module.scss'

const Header = () => {
	const { openPalette } = useCommandPalette();

	return (
		<header className={styles.header}>
			<Link href="/">pravindia<span className={styles.blinker}>_</span></Link>

			<button
				className={styles.searchBar}
				onClick={openPalette}
				aria-label="Open search"
				title="Press ⌘K or Ctrl+K"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
				<span>Search... &nbsp;&nbsp;&nbsp;&nbsp; </span>
				<kbd>⌘K</kbd>
			</button>

			<nav>
				<ul>
					<li><Link href="/#works">About</Link></li>
					<li><Link href="/blog">Blog</Link></li>
					<li>
						<a href="https://www.linkedin.com/in/pravindia" target="_blank" rel="noreferrer" >
							<span className={styles.openToWork}>Open to work</span>
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;