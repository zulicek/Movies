"use client";

import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./newMoviesSlice";
import currentMovieReducer from "./currentMovieSlice";
import filtersReducer from "./filtersSlice";
import favouritesReducer from "./favouritesSlice";
import genresReducer from "./genresSlice";
import mostWatchedMoviesReducer from "./mostWatchedMoviesSlice";
import streamingServicesReducer from "./streamingServicesSlice";
import searchReducer from "./searchSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    currentMovie: currentMovieReducer,
    filters: filtersReducer,
    favourites: favouritesReducer,
    genres: genresReducer,
    mostWatchedMovies: mostWatchedMoviesReducer,
    streamingServices: streamingServicesReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
