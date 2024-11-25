"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Genre } from "../types";

interface FiltersState {
  genre: Genre | null;
  scoreRange: [number, number];
  releaseYearRange: [number, number];
  searchQuery: string;
}

const initialState: FiltersState = {
  genre: null,
  scoreRange: [0, 10],
  releaseYearRange: [1900, 2024],
  searchQuery: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setGenre: (state, action: PayloadAction<Genre>) => {
      state.genre = action.payload;
    },
    setScoreRange: (state, action: PayloadAction<[number, number]>) => {
      state.scoreRange = action.payload;
    },
    setReleaseYearRange: (state, action: PayloadAction<[number, number]>) => {
      state.releaseYearRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setGenre, setScoreRange, setReleaseYearRange, setSearchQuery } =
  filtersSlice.actions;

export const selectGenre = (state: RootState) => state.filters.genre;
export const selectScoreRange = (state: RootState) => state.filters.scoreRange;
export const selectReleaseYearRange = (state: RootState) =>
  state.filters.releaseYearRange;

export const selectSearchQuery = (state: RootState) =>
  state.filters.searchQuery;

export default filtersSlice.reducer;
