import Image from 'next/image'
import Link from 'next/link'

import styles from './Header.module.scss'

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/">pravindia<span className={styles.blinker}>_</span></Link>
            <ul >
                {/* <li><Link href="#about">About</Link></li>
                <li><Link href="#works">Works</Link></li> */}
                <li><Link href="https://wa.me/+918870142519?text=" target={'_blank'}>Contact</Link></li>
            </ul>
        </header>
    );
}

export default Header;