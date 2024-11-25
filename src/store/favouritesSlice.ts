import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as favouritesService from "../services/favouritesServices";
import { RootState } from "./store";
import { FavouriteItem } from "../types";

const favouritesSlice = createSlice({
  name: "favourites",
  initialState:
    favouritesService.loadFavoritesFromLocalStorage() as FavouriteItem[],
  reducers: {
    loadAllFavourites: (state) => {
      state = favouritesService.loadFavoritesFromLocalStorage();
    },
    addToFavourites: (state, action: PayloadAction<FavouriteItem>) => {
      if (favouritesService.saveFavouriteToLocalStorage(action.payload))
        state.push(action.payload);
    },
    removeFromFavourites: (state, action: PayloadAction<FavouriteItem>) => {
      const index = state.findIndex(
        (item: FavouriteItem) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.splice(index, 1);
        favouritesService.removeFavouriteFromLocalStorage(action.payload);
      }
    },
  },
});

export const { loadAllFavourites, addToFavourites, removeFromFavourites } =
  favouritesSlice.actions;

export const selectFavourites = (state: RootState) => state.favourites;
export const checkIfFavourite = (
  favourites: FavouriteItem[],
  id: number
): boolean => favourites.findIndex((item) => item.id === id) !== -1;
export default favouritesSlice.reducer;
