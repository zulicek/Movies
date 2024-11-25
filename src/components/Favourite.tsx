import React from "react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { addToFavourites, removeFromFavourites } from "../store/favouritesSlice";
import { useAppDispatch } from "../store/store";

interface FavouriteProps {
   isFavourite: boolean | null
   movieId: number
   movieTitle: string
  }

export default function Favourite({ isFavourite, movieId, movieTitle }: FavouriteProps) {
  const dispatch = useAppDispatch();

  return isFavourite ? (
    <HeartFilled
      className="text-2xl text-secondary hover:opacity-70"
      onClick={() =>
        dispatch(
          removeFromFavourites({ id: movieId, title: movieTitle })
        )
      }
    />
  ) : (
    <HeartOutlined
      className="text-2xl text-secondary hover:opacity-70"
      onClick={() =>
        dispatch(
          addToFavourites({ id: movieId, title: movieTitle })
        )
      }
    />
  );
}

