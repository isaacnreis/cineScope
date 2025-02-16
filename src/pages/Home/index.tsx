import { useMovieContext } from "../../context/MovieContext.tsx";
import styles from "./Home.module.scss";
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

const Home = () => {
  const { state } = useMovieContext();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // filtrando filmes conforme a query
    const results = state.movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(state.searchQuery) ||
        movie.director.toLowerCase().includes(state.searchQuery) ||
        movie.mainActors.some((actor) =>
          actor.toLowerCase().includes(state.searchQuery)
        )
    );
    setFilteredMovies(results);
  }, [state.movies, state.searchQuery]);

  return (
    <main className={styles.home}>
      <h1>Catálogo de Filmes</h1>
      <div className={styles.movieGrid}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <img src={movie.posterUrl} alt={movie.title} />
              <h2>{movie.title}</h2>
              <p>Diretor: {movie.director}</p>
              <p>Atores: {movie.mainActors.join(", ")}</p>
              <button className={styles.favoriteBtn}>
                {movie.isFavorite ? "Remover dos Favoritos" : "Favoritar"}
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum filme encontrado.</p>
        )}
      </div>
    </main>
  );
};

export default Home;
