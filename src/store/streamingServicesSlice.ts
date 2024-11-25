import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as moviesService from "../services/moviesService";
import { RootState } from "./store";
import { Movie, StreamingService } from "../types";

interface StreamingServicesState {
  status: "idle" | "loading" | "succeeded" | "failed";
  items: StreamingService[];
  error: string | null;
  moviesByStreamingService: {
    [streamingServiceIds: string]: {
      movies: Movie[];
      status: "idle" | "loading" | "succeeded" | "failed";
    };
  };
}

const initialState: StreamingServicesState = {
  items: [],
  status: "idle",
  error: null,
  moviesByStreamingService: {},
};

export const getStreamingServices = createAsyncThunk(
  "movies/getStreamingServices",
  async () => {
    return await moviesService.fetchStreamingServices();
  }
);

export const getMoviesByStreamingService = createAsyncThunk(
  "movies/getMoviesByStreamingService",
  async (streamingServiceIds: number[]) => {
    return await moviesService.fetchMoviesByStreamingService(
      streamingServiceIds
    );
  }
);

const streamingServicesSlice = createSlice({
  name: "streamingServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStreamingServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.results) {
          state.items = action.payload.results
            .sort((a: any, b: any) => b.display_priority - a.display_priority)
            .slice(0, 10);
        } else {
          state.items = [];
        }
      })
      .addCase(getStreamingServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStreamingServices.rejected, (state) => {
        state.status = "failed";
        state.items = [];
        state.error = "Failed to load streaming services";
      })
      .addCase(getMoviesByStreamingService.pending, (state, action) => {
        const serviceIds: string = action.meta.arg.join("|");
        state.moviesByStreamingService[serviceIds] = {
          ...state.moviesByStreamingService[serviceIds],
          status: "loading",
        };
      })
      .addCase(getMoviesByStreamingService.fulfilled, (state, action) => {
        const { streamingServiceIds, movies } = action.payload;
        const serviceIds = streamingServiceIds.join("|");
        state.moviesByStreamingService[serviceIds] = {
          movies: movies.slice(0, 3),
          status: "succeeded",
        };
      })
      .addCase(getMoviesByStreamingService.rejected, (state, action) => {
        const serviceIds = action.meta.arg.join("|");
        state.moviesByStreamingService[serviceIds] = {
          movies: [],
          status: "failed",
        };
        state.error =
          action.error.message || "Failed to load movies by streaming service";
      });
  },
});

export const selectStreamingServices = (state: RootState) =>
  state.streamingServices.items;
export const selectStreamingServicesStatus = (state: RootState) =>
  state.streamingServices.status;
export const selectMoviesByStreamingService = (state: RootState) =>
  state.streamingServices.moviesByStreamingService;

export default streamingServicesSlice.reducer;
