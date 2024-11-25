"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import {
  setGenre,
  setScoreRange,
  setReleaseYearRange,
  setSearchQuery,
  selectGenre,
  selectScoreRange,
  selectReleaseYearRange,
  selectSearchQuery
} from "../store/filtersSlice";
import { getGenres, selectGenres } from "../store/genresSlice";

export default function Filters() {
  const dispatch = useAppDispatch();
  const genre = useSelector(selectGenre);
  const scoreRange = useSelector(selectScoreRange);
  const releaseYearRange = useSelector(selectReleaseYearRange);
  const genres = useSelector(selectGenres);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  return (
    <div className="flex lg:flex-row flex-col lg:space-x-8 space-y-2 lg:space-y-0 items-center lg:justify-center">
      <select
        value={genre?.name || ""}
        onChange={(e) => {
          const selectedGenre = genres?.find(g => g.name === e.target.value);
          if (selectedGenre) {
            dispatch(setGenre(selectedGenre));
          }
        }}
        className="w-full lg:w-[240px] p-2 border rounded bg-primary "
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </select>

      <div className="w-full lg:w-auto flex space-x-2 items-center">
        <label className="mr-2 whitespace-nowrap">Score Range:</label>
        <input
          type="number"
          value={scoreRange[0]}
          min={0}
          max={10}
          onChange={(e) =>
            dispatch(setScoreRange([Number(e.target.value), scoreRange[1]]))
          }
          className="w-16 p-2 border rounded bg-primary"
        />
        <input
          type="number"
          value={scoreRange[1]}
          min={0}
          max={10}
          onChange={(e) =>
            dispatch(setScoreRange([scoreRange[0], Number(e.target.value)]))
          }
          className="w-16 p-2 border rounded bg-primary"
        />
      </div>

      <div className="w-full lg:w-auto flex space-x-2 items-center">
        <label className="mr-2 whitespace-nowrap text-secondary">Release Year Range:</label>
        <input
          type="number"
          value={releaseYearRange[0]}
          min={1900}
          onChange={(e) =>
            dispatch(setReleaseYearRange([Number(e.target.value), releaseYearRange[1]]))
          }
          className="w-24 p-2 border rounded bg-primary"
        />
        <input
          type="number"
          value={releaseYearRange[1]}
          min={1900}
          onChange={(e) =>
            dispatch(setReleaseYearRange([releaseYearRange[0], Number(e.target.value)]))
          }
          className="w-24 p-2 border rounded bg-primary"
        />
      </div>
    </div>
  );
}
