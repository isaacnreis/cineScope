import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useMovieContext } from "../../context/MovieContext.tsx";
import { ChangeEvent } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { dispatch } = useMovieContext();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          CineScope
        </Link>
        <input
          type="text"
          placeholder="Buscar filmes"
          className={styles.search}
          onChange={handleSearch}
        />
        <div className={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/favorites">Favoritos</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
