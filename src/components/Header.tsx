"use client";

import React from "react";
import logoImage from "../../app/logo.webp";
import Image from "next/image";
import Link from "next/link";
import Search from "./Search";
import FavouritesList from "./FavouritesList";

export default function Header() {
  return (
    <header className="bg-primary">
      <div className="container mx-auto h-30 md:h-14 flex space-x-4 items-center px-4">
        <Link href="/" className="flex items-center">
          <Image
            src={logoImage}
            alt="Logo"
            width={131}
            className="object-contain"
          />
        </Link>
        <Link
          href="/movies"
          className="text-secondary text-sm px-2 py-2 relative hover:text-white whitespace-nowrap"
        >
          <span>Most Watched</span>
        </Link>
        <div className="flex items-center w-full">
          <Search dropdown={true} />
        </div>
        <FavouritesList />
      </div>
    </header>
  );
}
