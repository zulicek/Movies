import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../store/store";
import { setSearchQuery, selectSearchQuery } from "../store/filtersSlice";
import { getSearchMovies, selectSearchMovies } from "../store/searchSlice";
import { useSelector } from "react-redux";
import useClickOutside from "../hooks/useClickOutside";

export default function Search({ dropdown = true }: { dropdown?: boolean }) {
  const dispatch = useAppDispatch();
  const query = useSelector(selectSearchQuery);
  const results = useSelector(selectSearchMovies);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setShowDropdown(false));

  useEffect(() => {
    dispatch(getSearchMovies(query));
  }, [dispatch, query]);

  const handleKeyDown = (e:any) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (selectedIndex !== -1 && results[selectedIndex]) {
        router.push(`/movies/${results[selectedIndex].id}`);
        setShowDropdown(false);
      } else {
        router.push(`/movies`);
        setShowDropdown(false);
      }
    }
  };

  return (
    <div className="js-search-dropdown text-base relative flex items-center w-full">
      <SearchOutlined className="text-secondary absolute left-4" />
      <input
        type="text"
        className={`w-full p-3 text-sm text-white bg-primary-foreground rounded-t focus:outline-none pl-12 ${!dropdown && "rounded-b"}`}
        placeholder="Search movies..."
        value={query}
        onChange={(e) => {
          dispatch(setSearchQuery(e.target.value))
          setShowDropdown(true)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
      />
      {dropdown && showDropdown && results.length > 0 && (
        <ul ref={dropdownRef} className="absolute left-0 right-0 top-full rounded-b shadow-lg max-h-80 overflow-y-auto z-50 bg-primary-foreground">
          {results.map((movie, index) => (
            <li
              key={movie.id}
              className={`p-3 text-sm cursor-pointer text-secondary opacity-80 hover:text-white hover:underline hover:opacity-100 ${
                selectedIndex === index ? "underline text-white opacity-100" : ""
              }`}
              onClick={() => router.push(`/movies/${movie.id}`)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
