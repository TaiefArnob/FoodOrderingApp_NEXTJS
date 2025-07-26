"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

const galleryData = [
  {
    src: "/g1.jpg",
    category: "events",
    caption: "Birthday Celebration, March 2024",
  },
  {
    src: "/g2.jpg",
    category: "dining",
    caption: "Evening Dine-in Experience",
  },
  {
    src: "/g3.jpg",
    category: "sunset",
    caption: "Sunset View from Rooftop",
  },
  {
    src: "/g4.jpg",
    category: "events",
    caption: "Corporate Event Setup",
  },
  {
    src: "/g5.jpg",
    category: "dining",
    caption: "Cozy Dining Corner",
  },
  {
    src: "/g6.jpg",
    category: "sunset",
    caption: "Golden Hour Glow",
  },
  {
    src: "/g7.jpg",
    category: "sunset",
    caption: "Golden Hour Glow",
  },
  // Add more images as needed
];

const categories = ["all", "events", "dining", "sunset"];

const HeroGallery = () => {
  const [filter, setFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter images based on selected category
  const filteredImages =
    filter === "all"
      ? galleryData
      : galleryData.filter((img) => img.category === filter);

  // Prepare slides for Lightbox
  const slides = filteredImages.map((img) => ({
    src: img.src,
    title: img.caption,
  }));

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-extrabold text-[#4b0000] mb-8 text-center drop-shadow-sm">
        Our Rooftop Moments
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition
              ${
                filter === cat
                  ? "bg-amber-400 text-[#4b0000] shadow-lg"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-300"
              }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredImages.map((img, i) => (
          <div
            key={img.src}
            onClick={() => {
              setCurrentIndex(i);
              setLightboxOpen(true);
            }}
            className="relative overflow-hidden rounded-xl cursor-pointer shadow-md transform transition-transform duration-300 hover:scale-105"
            aria-label={`Open image: ${img.caption}`}
          >
            <Image
              src={img.src}
              alt={img.caption}
              width={400}
              height={300}
              className="object-cover w-full h-full"
              loading={i < 8 ? "eager" : "lazy"}
              priority={i < 4}
            />
            {/* Caption Overlay */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center text-amber-200 px-4 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
              <p className="text-sm md:text-base">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={currentIndex}
          plugins={[Captions]}
          captions={{ show: true }}
          onIndexChange={setCurrentIndex}
        />
      )}
    </section>
  );
};

export default HeroGallery;
