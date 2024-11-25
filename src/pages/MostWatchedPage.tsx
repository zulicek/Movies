"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import {
  getMostWatchedMovies,
  selectMostWatchedMovies,
  selectMostWatchedMoviesHasMore,
  selectMostWatchedMoviesStatus,
  selectMostWatchedMoviesPage,
} from "../store/mostWatchedMoviesSlice";
import MovieCard from "../components/MovieCard";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Filters from "../components/Filters";
import {
  selectGenre,
  selectScoreRange,
  selectReleaseYearRange,
  selectSearchQuery,
} from "../store/filtersSlice";
import { Genre, Movie } from "../types";
import Search from "../components/Search";

export default function MostWatchedPage() {
  const dispatch = useAppDispatch();
  const movies = useSelector(selectMostWatchedMovies);
  const status = useSelector(selectMostWatchedMoviesStatus);
  const hasMore = useSelector(selectMostWatchedMoviesHasMore);
  const page = useSelector(selectMostWatchedMoviesPage);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const genre = useSelector(selectGenre);
  const scoreRange = useSelector(selectScoreRange);
  const releaseYearRange = useSelector(selectReleaseYearRange);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const searchQuery = useSelector(selectSearchQuery);

  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (status === "loading" || !isClient) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(getMostWatchedMovies(page + 1));
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, hasMore, dispatch, page, isClient]
  );

  useEffect(() => {
    setIsClient(true);
    if (movies.length === 0 && status === "idle") {
      dispatch(getMostWatchedMovies(1));
    }
  }, [dispatch, movies.length, status]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      return movies.filter(
        (movie) =>
          (genre
            ? movie.genres.some((g: Genre) => g.id === genre.id)
            : true) &&
          (movie.release_date
            ? Number(movie.release_date.slice(0, 4)) >= releaseYearRange[0] &&
              Number(movie.release_date.slice(0, 4)) <= releaseYearRange[1]
            : true) &&
          movie.vote_average >= scoreRange[0] &&
          movie.vote_average <= scoreRange[1] &&
          (searchQuery !== ""
            ? movie.title.toUpperCase().includes(searchQuery.toUpperCase())
            : true)
      );
    };

    setFilteredMovies(applyFilters());
  }, [movies, scoreRange, releaseYearRange, genre, searchQuery]);

  if (!isClient) {
    return (
      <div className="flex justify-center p-4">
        <LoadingOutlined className="text-secondary text-2xl" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center my-8">
        Most Watched Movies
      </h1>
      <div className="container mx-auto px-4 mb-8">
        <div className="mb-8">
          <Filters />
        </div>
        <div className="mb-8 max-w-screen-sm mx-auto">
          <Search dropdown={false} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:mb-4">
          {filteredMovies.map((movie, index) => (
            <div
              key={movie.id}
              ref={
                index === filteredMovies.length - 1 ? lastMovieElementRef : null
              }
            >
              <MovieCard
                movie={movie}
                onClick={() => router.push(`/movies/${movie.id}`)}
              />
            </div>
          ))}
        </div>
        {status === "loading" && (
          <div className="flex justify-center items-center p-4">
            <LoadingOutlined className="text-secondary text-2xl" />
          </div>
        )}
        {status === "failed" && (
          <p className="text-red-500 text-center mt-4" role="alert">
            Error loading movies. Please try again later.
          </p>
        )}
        {!hasMore && status !== "loading" && (
          <p className="text-center mt-4">No more movies to load.</p>
        )}
      </div>
    </>
  );
}
