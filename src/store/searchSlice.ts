import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as moviesService from "../services/moviesService";
import { RootState } from "./store";
import { Movie, Genre } from "../types";

interface SearchState {
  items: Movie[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchState = {
  items: [],
  status: "idle",
  error: null,
};

export const getSearchMovies = createAsyncThunk(
  "movies/getSearchMovies",
  async (query: string) => {
    return await moviesService.fetchSearchMovies(query);
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSearchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.results) {
          state.items = action.payload.results;
        } else {
          state.items = [];
        }
      })
      .addCase(getSearchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSearchMovies.rejected, (state) => {
        state.status = "failed";
        state.items = [];
        state.error = "Failed to load search movies";
      });
  },
});

export const selectSearchMovies = (state: RootState) => state.search.items;
export const selectSearchMoviesStatus = (state: RootState) =>
  state.search.status;

export default searchSlice.reducer;
