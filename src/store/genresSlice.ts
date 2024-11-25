import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as moviesService from "../services/moviesService";
import { RootState } from "./store";
import { Movie, Genre } from "../types";

interface GenresState {
  items: Genre[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  moviesByGenre: {
    [genreId: number]: {
      movies: Movie[];
      status: "idle" | "loading" | "succeeded" | "failed";
    };
  };
}

const initialState: GenresState = {
  items: [],
  status: "idle",
  error: null,
  moviesByGenre: {},
};

export const getGenres = createAsyncThunk("movies/getGenres", async () => {
  return await moviesService.fetchGenres();
});

export const getMoviesByGenre = createAsyncThunk(
  "movies/getMoviesByGenre",
  async (genreId: number) => {
    return await moviesService.fetchMoviesByGenre(genreId);
  }
);

const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGenres.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.genres) {
          state.items = action.payload.genres.slice(0, 10);
        } else {
          state.items = [];
        }
      })
      .addCase(getGenres.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGenres.rejected, (state) => {
        state.status = "failed";
        state.items = [];
        state.error = "Failed to load genres";
      })
      .addCase(getMoviesByGenre.pending, (state, action) => {
        const genreId = action.meta.arg;
        state.moviesByGenre[genreId] = {
          ...state.moviesByGenre[genreId],
          status: "loading",
        };
      })
      .addCase(
        getMoviesByGenre.fulfilled,
        (
          state,
          action: PayloadAction<{ genreId: number; movies: Movie[] }>
        ) => {
          const { genreId, movies } = action.payload;
          state.moviesByGenre[genreId] = {
            movies,
            status: "succeeded",
          };
        }
      )
      .addCase(getMoviesByGenre.rejected, (state, action) => {
        const genreId = action.meta.arg;
        state.moviesByGenre[genreId] = {
          movies: [],
          status: "failed",
        };
        state.error = action.error.message || "Failed to load movies by genre";
      });
  },
});

export const selectGenres = (state: RootState) => state.genres.items;
export const selectGenresStatus = (state: RootState) => state.genres.status;
export const selectMoviesByGenre = (state: RootState) =>
  state.genres.moviesByGenre;

export default genresSlice.reducer;
