import { FavouriteItem } from '../types';
import { isBrowser } from '../../lib/utils';

const FAVOURITES_STORAGE_KEY = 'favourites';


export const saveFavouritesToLocalStorage = (favouritesList: FavouriteItem[]) => {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouritesList));
};

export const loadFavoritesFromLocalStorage = () => {
  if (isBrowser()) {
    return JSON.parse(localStorage.getItem(FAVOURITES_STORAGE_KEY) || '[]');
  }
  return [];
};

export const saveFavouriteToLocalStorage = (favouriteItem: FavouriteItem) => {
  const favouritesList = loadFavoritesFromLocalStorage();

  if (favouritesList.findIndex((item: FavouriteItem) => item.id ===  favouriteItem.id) !== -1) {
    return false;
  } else {
    favouritesList.push(favouriteItem);
    saveFavouritesToLocalStorage(favouritesList);
    return true
  }
};

export const removeFavouriteFromLocalStorage = (favouriteItem: FavouriteItem) => {
  const favouritesList = loadFavoritesFromLocalStorage();
  favouritesList.length > 0 && favouritesList.splice(favouritesList.findIndex((item: FavouriteItem) => item.id ===  favouriteItem.id), 1);
  saveFavouritesToLocalStorage(favouritesList);
};

