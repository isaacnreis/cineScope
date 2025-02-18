import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { getMovies } from "../services/tmdbApi.ts";
import { toggleFavorite } from "./movieHelpers.ts";

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
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
}

// Ações possíveis no reducer
type Action =
  | { type: "SET_MOVIES"; payload: Movie[] }
  | { type: "TOGGLE_FAVORITES"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_LOADING"; payload: boolean };

// Estado inicial
const initialState: State = {
  movies: [],
  favorites: [],
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
};

// Função reducer
const movieReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MOVIES":
      return { ...state, movies: action.payload, isLoading: false };
    case "TOGGLE_FAVORITES": {
      const updatedMovies = toggleFavorite(state.movies, action.payload);
      const updatedFavorites = updatedMovies.filter(
        (movie) => movie.isFavorite
      );
      return { ...state, movies: updatedMovies, favorites: updatedFavorites };
    }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
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

  const fetchMovies = async (searchQuery: string, page: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const { movies, totalPages } = await getMovies(searchQuery, page);
    const formattedMovies = movies.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      director: movie.director,
      mainActors: movie.mainActors,
      keywords: movie.keywords,
      posterUrl: movie.posterUrl,
      isFavorite: false,
    }));
    dispatch({ type: "SET_MOVIES", payload: formattedMovies });
    dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
    dispatch({ type: "SET_LOADING", payload: false });
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

    // Chama a função para carregar os filmes na inicialização
    fetchMovies("a", 1);
  }, []);

  useEffect(() => {
    if (state.searchQuery) {
      fetchMovies(state.searchQuery, state.currentPage);
    } else {
      fetchMovies("a", state.currentPage);
    }
  }, [state.searchQuery, state.currentPage]);

  return (
    <MovieContext.Provider value={{ state, dispatch, toggleFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};

// Hook para usar o Context
export const useMovieContext = () => useContext(MovieContext);
