"use client";

import React from "react";
import { Movie } from "../types";
import { IMG_URL } from "../services/api";
import {
  checkIfFavourite,
  selectFavourites,
} from "../store/favouritesSlice";
import { useSelector } from "react-redux";
import Favourite from "./Favourite";
import { StarFilled } from "@ant-design/icons";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const favouritesState = useSelector(selectFavourites);
  const isFavourite = checkIfFavourite(favouritesState, movie.id);

  return (
    <div className="overflow-hidden relative tracking-normal group w-full">
      <div onClick={onClick} className="w-full h-full relative cursor-pointer">
        <img
          className="w-full h-full object-cover"
          src={`${IMG_URL}${movie.poster_path}`}
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-between text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
        <div className="w-full h-full cursor-pointer" onClick={onClick}>
          <h4>{movie.title}</h4>
          <p className="text-sm text-secondary">{movie.release_date.slice(0, 4)}, <span className="text-yellow-500">
                  <StarFilled /> {movie.vote_average}
                </span></p>
        </div>

        <Favourite
          isFavourite={isFavourite}
          movieId={movie.id}
          movieTitle={movie.title}
        />
      </div>
    </div>
  );
}
