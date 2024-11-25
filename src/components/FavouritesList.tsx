"use client";
import React, { useState, useRef } from "react";
import { HeartOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import {
  selectFavourites,
  removeFromFavourites,
} from "../store/favouritesSlice";
import { CloseOutlined, HeartFilled } from "@ant-design/icons";
import { FavouriteItem } from "../types";
import Link from "next/link";
import useClickOutside from "../hooks/useClickOutside";

export default function FavouritesList() {
  const dispatch = useAppDispatch();
  const favourites = useSelector(selectFavourites);
  const [showFavourites, setShowFavourites] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setShowFavourites(false));

  return (
    <div className="relative">
      <button
        onClick={() => setShowFavourites(true)}
        className="text-secondary px-2 py-2 hover:text-white"
      >
        {favourites.length > 0 ? (
          <HeartFilled className="text-2xl text-secondary" />
        ) : (
          <HeartOutlined className="text-2xl text-secondary" />
        )}

        {favourites.length > 0 && (
          <span className="absolute top-0 right-0 text-xs font-bold text-white">
            {favourites.length}
          </span>
        )}
      </button>

      {showFavourites && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 right-0 bg-primary-foreground rounded-lg shadow-lg p-4 w-80 max-h-80 overflow-y-auto z-50"
        >
          <CloseOutlined
            onClick={() => setShowFavourites(false)}
            className="absolute top-4 right-4 text-secondary hover:text-gray-900 cursor-pointer text-base"
          />
          <h4 className="text-xs mb-4">Your Favourites</h4>
          {favourites.length === 0 ? (
            <p>You don't have any favourites yet.</p>
          ) : (
            <>
              {favourites.map((item: FavouriteItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-1"
                >
                  <Link
                    href={`/movies/${item.id}`}
                    onClick={() => setShowFavourites(false)}
                    className="w-full hover:underline"
                  >
                    <h3 className="font-semibold">{item.title}</h3>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <HeartFilled
                      className="text-xl"
                      onClick={() => dispatch(removeFromFavourites(item))}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
