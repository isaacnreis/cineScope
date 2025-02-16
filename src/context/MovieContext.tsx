import React, { createContext, ReactNode, useContext, useReducer } from "react";

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
}>({ state: initialState, dispatch: () => null });

// Provedor do context
export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};

// Hook para usar o Context
export const useMovieContext = () => useContext(MovieContext);
