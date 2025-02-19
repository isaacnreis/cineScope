import { useMovieContext } from "../../context/MovieContext.tsx";
import styles from "./Favorites.module.scss";
import { useEffect, useState } from "react";

interface Movie {
  id: string;
  title: string;
  director: string;
  mainActors: string[];
  keywords: string[];
  posterUrl: string;
  isFavorite: boolean;
}

const Favorites = () => {
  const { state, toggleFavorite } = useMovieContext();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const favs = state.movies.filter((movie) => movie.isFavorite);
    setFavoriteMovies(favs);
  }, [state.movies]);

  return (
    <main className={styles.favorites}>
      <h1>Meus Favoritos</h1>
      <div className={styles.movieGrid}>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <img src={movie.posterUrl} alt={movie.title} />
              <h2>{movie.title}</h2>
              <p>Diretor: {movie.director}</p>
              <p>Atores: {movie.mainActors.join(", ")}</p>
              <button
                className={styles.favoriteBtn}
                onClick={() => toggleFavorite(movie.id)}
              >
                Remover dos Favoritos
              </button>
            </div>
          ))
        ) : (
          <p>Você ainda não favoritou nenhum filme.</p>
        )}
      </div>
    </main>
  );
};

export default Favorites;
