import api from "./api";

export const fetchNewMovies = async () => {
  const response = await api.get("/movie/now_playing?language=en-US&page=1");
  return response.data;
};

export const fetchMovie = async (id: number) => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};

export const fetchCast = async (id: number) => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};

export const fetchGenres = async () => {
  const response = await api.get("/genre/movie/list?language=en-US");
  return response.data;
};

export const fetchMoviesByGenre = async (genreId: number) => {
  const response = await api.get(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`
  );
  return { genreId: genreId, movies: response.data.results };
};

export const fetchStreamingServices = async () => {
  const response = await api.get("/watch/providers/movie");
  return response.data;
};

export const fetchMoviesByStreamingService = async (
  streamingServiceIds: number[]
) => {
  const idsString = streamingServiceIds.join("|");
  const response = await api.get(
    `/discover/movie?with_watch_provider=${idsString}&sort_by=popularity.desc`
  );
  return { streamingServiceIds, movies: response.data.results };
};

export const fetchMostWatchedMovies = async (page: number) => {
  const response = await api.get(`/movie/popular?language=en-US&page=${page}`);
  return response.data;
};

export const fetchSearchMovies = async (query: string) => {
  const response = await api.get(`/search/movie?query=${query}`);
  return response.data;
};
