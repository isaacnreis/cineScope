import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { getMovies } from "../services/tmdbApi.ts";

// Tipagem do filme
export interface Movie {
  id: string;
  title: string;
  director: string;
  mainActors: string[];
  keywords: string[];
  posterUrl: string;
  isFavorite: boolean;
}

// Tpagem do estado global
interface State {
  movies: Movie[];
  favorites: Movie[];
  searchQuery: string;
}

// Ações possíveis no reducer
type Action =
  | { type: "SET_MOVIES"; payload: Movie[] }
  | { type: "TOGGLE_FAVORITES"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string };

// Estado inicial
const initialState: State = {
  movies: [],
  favorites: [],
  searchQuery: "",
};

// Função reducer
const movieReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MOVIES":
      return { ...state, movies: action.payload };
    case "TOGGLE_FAVORITES": {
      const updateMovies = state.movies.map((movie) =>
        movie.id === action.payload
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      );
      const updateFavorites = updateMovies.filter((movie) => movie.isFavorite);
      return { ...state, movies: updateMovies, favorites: updateFavorites };
    }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

// Context
const MovieContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  toggleFavorite: (movieId: string) => void;
}>({ state: initialState, dispatch: () => null, toggleFavorite: () => null });

// Provedor do context
export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Função para alternar o favorito de um filme
  const toggleFavorite = (movieId: string) => {
    dispatch({ type: "TOGGLE_FAVORITES", payload: movieId });
  };

  // Sincroniza com o localStorage sempre que os filmes mudam
  useEffect(() => {
    const favoriteMovies = state.movies
      .filter((movie) => movie.isFavorite)
      .map((movie) => movie.id);

    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  }, [state.movies]);

  // Recupera favoritos do localStorage na inicialização
  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteMovies") || "[]"
    );
    if (savedFavorites.length > 0) {
      const updatedMovies = state.movies.map((movie) => ({
        ...movie,
        isFavorite: savedFavorites.includes(movie.id),
      }));
      dispatch({ type: "SET_MOVIES", payload: updatedMovies });
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await getMovies(state.searchQuery);
      console.log(movies);
      const formattedMovies = movies.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        director: "Desconhecido",
        mainActors: [],
        keywords: movie.genre_ids || [],
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        isFavorite: false,
      }));
      dispatch({ type: "SET_MOVIES", payload: formattedMovies });
    };

    if (state.searchQuery) {
      fetchMovies();
    }
  }, [state.searchQuery]);

  return (
    <MovieContext.Provider value={{ state, dispatch, toggleFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};

// Hook para usar o Context
export const useMovieContext = () => useContext(MovieContext);
