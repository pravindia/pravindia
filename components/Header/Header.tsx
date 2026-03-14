import Link from 'next/link'

import styles from './Header.module.scss'

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/">pravindia<span className={styles.blinker}>_</span></Link>
            <nav>
                <ul>
                    <li><Link href="/#works">About</Link></li>
                    <li><Link href="/blog">Blog</Link></li>
                    <li>
                        <a href="https://wa.me/+918870142519?text=" target="_blank" rel="noreferrer" >

                            <span className={styles.openToWork}>Open to work</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;