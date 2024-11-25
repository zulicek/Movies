"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import {
  getNewMovies,
  selectNewMovies,
  selectNewMoviesStatus,
} from "../store/newMoviesSlice";
import {
  getGenres,
  selectGenres,
  selectGenresStatus,
  getMoviesByGenre,
  selectMoviesByGenre,
} from "../store/genresSlice";
import {
  getStreamingServices,
  selectStreamingServices,
  selectStreamingServicesStatus,
  getMoviesByStreamingService,
  selectMoviesByStreamingService,
} from "../store/streamingServicesSlice";
import MoviesGrid from "../components/MoviesGrid";
import { LoadingOutlined } from "@ant-design/icons";
import { IMG_URL } from "../services/api";

export default function Homepage() {
  const dispatch = useAppDispatch();
  const status = useSelector(selectNewMoviesStatus);
  let newMovies = useSelector(selectNewMovies);
  const movies = useMemo(() => newMovies.slice(0, 5), [newMovies]);
  const genres = useSelector(selectGenres);
  const genresStatus = useSelector(selectGenresStatus);
  const moviesByGenre = useSelector(selectMoviesByGenre);
  const streamingServices = useSelector(selectStreamingServices);
  const streamingServicesStatus = useSelector(selectStreamingServicesStatus);
  const moviesByStreamingService = useSelector(selectMoviesByStreamingService);
  const providerIds =
    streamingServices.map((service) => service.provider_id) || [];

  useEffect(() => {
    dispatch(getNewMovies());
    dispatch(getStreamingServices());
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresStatus === "succeeded") {
      genres.forEach((genre) => {
        dispatch(getMoviesByGenre(genre.id));
      });
    }
  }, [dispatch, genres, genresStatus]);

  useEffect(() => {
    if (
      streamingServicesStatus === "succeeded" &&
      streamingServices.length > 0
    ) {
      dispatch(getMoviesByStreamingService(providerIds));
    }
  }, [dispatch, streamingServices, streamingServicesStatus]);

  return (
    <div className="container mx-auto px-4 py-8">
      {status === "loading" && (
        <div className="flex justify-center p-4">
          <LoadingOutlined className="text-secondary text-2xl" />
        </div>
      )}
      {status === "failed" && <div>Error loading movies</div>}
      {status === "succeeded" && (
        <>
          {
            <MoviesGrid
              title="The Latest Movies This Week"
              description="The latest movies this week bring exciting premieres, from action blockbusters to emotional dramas. Check out what the big screen has in store for you this week!"
              movies={movies}
            />
          }
        </>
      )}

      {genresStatus === "failed" && <div>Error loading genres</div>}
      {genresStatus === "loading" && (
        <div className="flex justify-center p-4">
          <LoadingOutlined className="text-secondary text-2xl" />
        </div>
      )}
      {genresStatus === "succeeded" &&
        genres &&
        Object.keys(moviesByGenre).length > 0 && (
          <>
            <h2 className="text-4xl font-bold text-center my-8">
              Movies by genre
            </h2>
            {genres.map((genre) => (
              <div key={genre.id}>
                {moviesByGenre[genre.id].status === "loading" && (
                  <div className="flex justify-center p-4">
                    <LoadingOutlined className="text-secondary text-2xl" />
                  </div>
                )}
                {moviesByGenre[genre.id].status === "failed" && (
                  <div>Error loading movies</div>
                )}
                {moviesByGenre[genre.id].status === "succeeded" &&
                  moviesByGenre[genre.id].movies && (
                    <MoviesGrid
                      title={`${genre.name} movies`}
                      movies={moviesByGenre[genre.id].movies}
                    />
                  )}
              </div>
            ))}
          </>
        )}

      {streamingServicesStatus === "failed" && (
        <div>Error loading services</div>
      )}
      {streamingServicesStatus === "loading" && (
        <div className="flex justify-center p-4">
          <LoadingOutlined className="text-secondary text-2xl" />
        </div>
      )}
      {streamingServicesStatus === "succeeded" &&
        streamingServices.length > 0 && (
          <>
            <h2 className="text-4xl font-bold text-center my-8">
              Most Watched Streaming Services
            </h2>
            <div className="grid grid-cols-5 lg:grid-cols-10 gap-4 mb-8">
              {streamingServices.map((streamingService) => (
                <div key={streamingService.provider_id} className="mb-4">
                  <img
                    className="w-20 h-20 object-cover"
                    src={`${IMG_URL}${streamingService.logo_path}`}
                  />
                </div>
              ))}
            </div>
            {Object.keys(moviesByStreamingService).length > 0 &&
              providerIds.length > 0 && (
                <>
                  {moviesByStreamingService[providerIds.join("|")].status ===
                    "loading" && (
                    <div className="flex justify-center p-4">
                      <LoadingOutlined className="text-secondary text-2xl" />
                    </div>
                  )}
                  {moviesByStreamingService[providerIds.join("|")].status ===
                    "failed" && <div>Error loading movies</div>}
                  {moviesByStreamingService[providerIds.join("|")].status ===
                    "succeeded" &&
                    moviesByStreamingService[providerIds.join("|")].movies && (
                      <MoviesGrid
                        title="Top 3 Movies"
                        description="Most Popular Movies on these Streaming Services!"
                        movies={
                          moviesByStreamingService[providerIds.join("|")].movies
                        }
                      />
                    )}
                </>
              )}
          </>
        )}
    </div>
  );
}
