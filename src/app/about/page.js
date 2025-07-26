"use client";

import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 py-20 px-4 md:px-10 bg-[#fffaf0]">
      {/* Text Section */}
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#4b0000] leading-tight drop-shadow-sm">
          About <span className="text-amber-500">Pipra Kitchen</span>
        </h1>
        <p className="text-lg md:text-xl text-[#4b0000]">
          Pipra Kitchen is more than a rooftop restaurant — it's an experience crafted with love, tradition, and a passion for authentic food. Nestled above the city, we blend flavors of heritage with a modern vibe to give you a taste of home, under the open sky.
        </p>
        <p className="text-base md:text-lg text-[#4b0000]">
          Founded in 2020 in Dhaka, we started as a small family-owned kitchen and have grown into a community-loved eatery where every dish tells a story. Whether it’s a cozy dinner, a celebration, or just a casual evening, Pipra Kitchen welcomes you with warmth.
        </p>
        <div className="pt-4">
          <a
            href="/contact"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-[#4b0000] font-semibold text-base md:text-lg px-6 py-3 rounded-full transition duration-300 shadow-md"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 w-full flex justify-center">
        <div className="w-[320px] h-[360px] md:w-[480px] md:h-[420px] relative rounded-2xl overflow-hidden shadow-xl border-4 border-amber-100">
          <Image
            src="/aboutus.jpg"
            alt="About Pipra Kitchen"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default About;
