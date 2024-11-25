"use client";
import React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../store/store";
import {
  selectMovie,
  selectMovieStatus,
  selectCast,
  getMovie,
  getCast,
} from "../store/currentMovieSlice";
import { useSelector } from "react-redux";
import { IMG_URL } from "../services/api";
import { StarFilled, FlagFilled, LoadingOutlined } from "@ant-design/icons";
import { checkIfFavourite, selectFavourites } from "../store/favouritesSlice";
import Favourite from "../components/Favourite";
import { CastItem } from "../types";

export default function MoviePage({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const movie = useSelector(selectMovie);
  const cast = useSelector(selectCast);
  const status = useSelector(selectMovieStatus);
  const favouritesState = useSelector(selectFavourites);
  const isFavourite = movie && checkIfFavourite(favouritesState, movie.id);

  useEffect(() => {
    dispatch(getMovie(Number(id)));
    dispatch(getCast(Number(id)));
  }, [dispatch, id]);

  return (
    <>
      {status === "loading" && (
        <div className="flex justify-center p-4">
          <LoadingOutlined className="text-secondary text-2xl" />
        </div>
      )}
      {status === "failed" && <div>Error loading movie</div>}
      {status === "succeeded" && movie && (
        <div>
          <div className="flex bg-primary relative min-h[250px]">
            <div className="px-4 flex flex-col space-y-4 justify-center ml-auto w-full sm:w-[320px] md:w-[384px] lg:w-[512px] xl:w-[640px] 2xl:w-[768px]">
              <h1 className="text-4xl font-bold uppercase">{movie.title}</h1>
              <div className="flex space-x-8 text-secondary align-items-center">
                <span className="text-yellow-500">
                  <StarFilled /> {movie.vote_average}
                </span>
                <span>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
                <span className="font-bold text-secondary">
                  ({movie.release_date.slice(0, 4)})
                </span>
                <Favourite
                  isFavourite={isFavourite}
                  movieId={movie.id}
                  movieTitle={movie.title}
                />
              </div>
            </div>
            <div className="w-1/2 h-full relative">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#03060c] to-[rgba(12,19,30,0)] z-20"></div>
              <img
                className="w-full h-full object-cover"
                src={`${IMG_URL}${movie.backdrop_path}`}
              />
            </div>
          </div>
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-4">
                {movie.genres && (
                  <div className="flex space-x-4">
                    {movie.genres.map((genre) => (
                      <span className="font-bold text-secondary">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movie.production_countries && (
                  <div className="flex space-x-4">
                    <FlagFilled />
                    {movie.production_countries.map((country) => (
                      <span className="font-bold">{country.name}</span>
                    ))}
                  </div>
                )}

                <p>{movie.overview}</p>
              </div>
              {cast && (
                <div className="flex flex-col space-y-4">
                  <h3>Cast</h3>
                  {cast.map((cast: CastItem, index: number) => (
                    <div key={index} className="flex space-x-4 items-center">
                      <img
                        className="w-8 h-8 rounded-full bg-secondary object-cover"
                        src={`${IMG_URL}${cast.profile_path}`}
                      />
                      <div className="flex space-x-2">
                        <span className="text-secondary">{cast.name}</span>
                        <span>as</span>
                        <span className="font-bold">{cast.character}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
