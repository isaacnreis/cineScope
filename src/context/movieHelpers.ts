import { Movie } from "./MovieContext.tsx";

export const toggleFavorite = (movies: Movie[], movieId: string) => {
  return movies.map((movie) =>
    movie.id === movieId ? { ...movie, isFavorite: !movie.isFavorite } : movie
  );
};
