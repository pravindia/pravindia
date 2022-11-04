import styles from "./Footer.module.scss";

const Footer = (props: { textEnter: any; textLeave: any }) => {
  return (
    <footer className={styles.footer}>
      <div>
        <a href="tel:+918870142519">+91 8870 142519</a>
        <a href="tel:+918870142519">pravindia@smazee.com</a>
      </div>
      <div>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          href=""
        >
          Resumé
        </a>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          href=""
        >
          LinkedIn
        </a>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          href=""
        >
          Codepen
        </a>
      </div>
    </footer>
  );
};

export default Footer;
