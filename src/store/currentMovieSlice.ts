import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as moviesService from "../services/moviesService";
import { RootState } from "./store";
import { Movie, CastItem } from "../types";

interface CurrentMovieState {
  movie: Movie | null;
  cast: CastItem[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CurrentMovieState = {
  movie: null,
  cast: null,
  status: "idle",
  error: null,
};

export const getMovie = createAsyncThunk(
  "movies/getMovie",
  async (id: number) => {
    return await moviesService.fetchMovie(id);
  }
);

export const getCast = createAsyncThunk(
  "movies/getCast",
  async (id: number) => {
    return await moviesService.fetchCast(id);
  }
);

const currentMovieSlice = createSlice({
  name: "currentMovie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMovie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movie = {
          id: action.payload.id,
          title: action.payload.title,
          overview: action.payload.overview,
          genres: action.payload.genres,
          runtime: action.payload.runtime,
          production_countries: action.payload.production_countries,
          vote_average: action.payload.vote_average,
          poster_path: action.payload.poster_path,
          backdrop_path: action.payload.backdrop_path,
          release_date: action.payload.release_date,
        };
      })
      .addCase(getMovie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovie.rejected, (state) => {
        state.status = "failed";
        state.movie = null;
        state.error = "Failed to load movie";
      })
      .addCase(getCast.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.cast) {
          state.cast = action.payload.cast.slice(0, 10);
        } else {
          state.cast = [];
        }
      })
      .addCase(getCast.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCast.rejected, (state) => {
        state.status = "failed";
        state.cast = null;
        state.error = "Failed to load cast";
      });
  },
});

export const selectMovie = (state: RootState) => state.currentMovie.movie;
export const selectMovieStatus = (state: RootState) =>
  state.currentMovie.status;
export const selectCast = (state: RootState) => state.currentMovie.cast;

export default currentMovieSlice.reducer;
