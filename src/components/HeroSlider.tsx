"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    subtitle: "WELCOME TO BOOKNOOK",
    title: "Every Book Opens a New World",
    description:
      "Discover wonderful stories, explore new ideas, and find your next favorite book in our online library.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600",
    button: "Explore Books",
    link: "/books",
  },
  {
    subtitle: "YOUR NEXT CHAPTER STARTS HERE",
    title: "Find Stories That Stay With You",
    description:
      "From timeless classics to exciting new discoveries, there is always something waiting for you.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600",
    button: "Browse Collection",
    link: "/books",
  },
  {
    subtitle: "READ. SHARE. DISCOVER.",
    title: "A Little Corner for Every Book Lover",
    description:
      "Build your reading journey, share your collection, and connect with the joy of reading.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1600",
    button: "Get Started",
    link: "/register",
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      loop
      className="home-slider"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="relative flex min-h-[560px] items-center bg-cover bg-center md:min-h-[650px]"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#102c22]/95 via-[#183a2d]/75 to-black/20" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
              <div className="max-w-2xl">
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#f5c58d] backdrop-blur-sm">
                  <Sparkles size={15} />
                  {slide.subtitle}
                </span>

                <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                  {slide.title}
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-gray-200 md:text-lg">
                  {slide.description}
                </p>

                <Link
                  href={slide.link}
                  className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#e6a45d] px-7 py-4 font-bold text-[#19382c] shadow-lg transition hover:-translate-y-1 hover:bg-[#f2b978]"
                >
                  {slide.button}
                  <ArrowRight size={19} />
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}