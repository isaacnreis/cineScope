import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getMovies = async (query: string, page: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        language: "pt-br",
        page: page,
      },
    });
    const movies = response.data.results;
    const totalPages = response.data.total_pages;

    const detailedMovies = await Promise.all(
      movies.map(async (movie: any) => {
        const details = await axios.get(
          `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits`
        );

        const { credits, genres } = details.data;
        const director =
          credits.crew.find((person: any) => person.job === "Director")?.name ||
          "Desconhecido";

        const mainActors = credits.cast
          .slice(0, 3)
          .map((actor: any) => actor.name);

        const keywords = genres.map((genre: any) => genre.name);

        return {
          id: movie.id,
          title: movie.title,
          director,
          mainActors,
          keywords,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          isFavorite: false,
        };
      })
    );

    return { movies: detailedMovies, totalPages };
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return { movies: [], totalPages: 1 };
  }
};
