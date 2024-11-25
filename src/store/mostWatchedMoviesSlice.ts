import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as moviesService from "../services/moviesService";
import { RootState } from "./store";
import { Movie } from "../types";

interface MostWatchedMoviesState {
  error: string | null;
  movies: Movie[];
  status: "idle" | "loading" | "succeeded" | "failed";
  page: number;
  hasMore: boolean;
}

const initialState: MostWatchedMoviesState = {
  error: null,
  movies: [],
  status: "idle",
  page: 1,
  hasMore: true,
};

export const getMostWatchedMovies = createAsyncThunk(
  "movies/getMostWatchedMovies",
  async (page: number) => {
    return await moviesService.fetchMostWatchedMovies(page);
  }
);

const mostWatchedMoviesSlice = createSlice({
  name: "mostWatchedMovies",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setMostWatchedMoviesHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMostWatchedMovies.fulfilled, (state, action) => {
        state.status = "succeeded";

        const processedResults = action.payload.results.map((newMovie: any) => ({
          ...newMovie,
          genres: newMovie.genre_ids.map((id: number) => ({ id, name: id }))
        }));

        const filteredResults = processedResults.filter(
          (newMovie: Movie) =>
            !state.movies.find((oldMovie) => oldMovie.id === newMovie.id)
        );
        state.movies = [...state.movies, ...filteredResults];
        state.hasMore = action.payload.page < action.payload.total_pages;
        state.page = action.payload.page;
      })
      .addCase(getMostWatchedMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMostWatchedMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to load most watched movies";
      });
  },
});

export const { setPage, setMostWatchedMoviesHasMore } =
  mostWatchedMoviesSlice.actions;

export const selectMostWatchedMovies = (state: RootState) =>
  state.mostWatchedMovies.movies;
export const selectMostWatchedMoviesStatus = (state: RootState) =>
  state.mostWatchedMovies.status;
export const selectMostWatchedMoviesError = (state: RootState) =>
  state.mostWatchedMovies.error;
export const selectMostWatchedMoviesPage = (state: RootState) =>
  state.mostWatchedMovies.page;
export const selectMostWatchedMoviesHasMore = (state: RootState) =>
  state.mostWatchedMovies.hasMore;

export default mostWatchedMoviesSlice.reducer;
