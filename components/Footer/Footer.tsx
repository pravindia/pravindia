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
          target="_blank"
          rel="noreferrer"
          download={true}
          href="https://pravindia.com/assets/resume.pdf"
        >
          Resumé
        </a>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/pravindia"
        >
          LinkedIn
        </a>
        <a
          onMouseEnter={props.textEnter}
          onMouseLeave={props.textLeave}
          target="_blank"
          rel="noreferrer"
          href="https://codepen.io/pravindia"
        >
          Codepen
        </a>
      </div>
    </footer>
  );
};

export default Footer;
