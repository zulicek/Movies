"use client";

import React from "react";
import MoviesCard from "./MovieCard";
import { Movie } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IMG_URL } from "../services/api";
import { useRouter } from "next/navigation";

interface MoviesGridProps {
  image?: string;
  title?: string;
  description?: string;
  movies: Movie[];
}

export default function MoviesGrid({
  image,
  title,
  description,
  movies,
}: MoviesGridProps) {
  const router = useRouter();
  return (
    <div className="flex lg:flex-row flex-col lg:space-x-8">
      <div className="w-full lg:w-1/4 xl:w-1/5 mb-8 lg:mb-0">
        {image && (
          <div className="flex justify-center"><img className="w-20 h-20 object-cover" src={`${IMG_URL}${image}`} /></div>
        )}

        {title && <h2 className="text-2xl font-bold mb-5">{title}</h2>}

        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1.5,
          },
          576: {
            slidesPerView: 2,
          },
          900: {
            slidesPerView: 2.75,
          },
          1280: {
            slidesPerView: 3.25,
          },
        }}
        slidesPerGroup={1}
        spaceBetween={30}
        navigation={true}
        modules={[Navigation]}
        className="w-full mb-8"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <div
              className="flex tracking-[-20px] h-full items-end w-full"
              key={movie.id}
            >
              <div className="text-[120px] lg:text-[180px] font-bold text-muted leading-none">
                {index + 1}
              </div>
              <MoviesCard key={movie.id} movie={movie} onClick={() => router.push(`/movies/${movie.id}`)} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
