import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as moviesService from "../services/moviesService";
import { RootState } from "./store";
import { Movie, CastItem, StreamingService } from "../types";

interface NewMoviesState {
  items: Movie[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NewMoviesState = {
  status: "idle",
  error: null,
  items: [],
};

export const getNewMovies = createAsyncThunk(
  "movies/getNewMovies",
  async () => {
    return await moviesService.fetchNewMovies();
  }
);

const newMoviesSlice = createSlice({
  name: "newMovies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNewMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.results;
      })
      .addCase(getNewMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewMovies.rejected, (state) => {
        state.status = "failed";
        state.items = [];
        state.error = "Failed to load movies";
      });
  },
});

export const selectNewMovies = (state: RootState) => state.movies.items;
export const selectNewMoviesStatus = (state: RootState) => state.movies.status;

export default newMoviesSlice.reducer;
