import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        ©Isaac N. Reis {new Date().getFullYear()} CineScope. Todos os direitos
        reservados.
      </p>
    </footer>
  );
};

export default Footer;
