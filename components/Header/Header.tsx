import Image from 'next/image'
import Link from 'next/link'

import styles from './Header.module.scss'

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/">pravindia<span className={styles.blinker}>_</span></Link>
        </header>
    );
}

export default Header;