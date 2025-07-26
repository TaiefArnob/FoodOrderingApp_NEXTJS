'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi'; // ⬅️ Import the arrow icon

const foodImages = ['/h1.jpg', '/h2.jpg', '/h3.jpg']; // Make sure these exist in public/

const HeroFood = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % foodImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 py-16 px-4 md:px-8">
      {/* Text Section */}
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#4b0000] leading-tight drop-shadow-sm">
          Taste the Rooftop Magic
        </h1>
        <p className="text-xl md:text-2xl text-[#4b0000]">
          Welcome to <strong>Pipra Kitchen</strong> – where flavor meets the skyline.
          Enjoy mouth-watering meals in a warm and vibrant rooftop setting.
        </p>
        <a
          href="/menu"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#4b0000] font-semibold text-base md:text-lg px-6 py-3 rounded-full transition duration-300 shadow-md"
        >
          Explore Menu <FiArrowRight className="text-xl" />
        </a>
      </div>

      {/* Image Slider Section */}
      <div className="md:w-1/2 w-full flex justify-center">
        <div className="w-[320px] h-[360px] md:w-[480px] md:h-[420px] relative rounded-2xl overflow-hidden shadow-xl border-4 border-amber-100">
          {foodImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Food ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                current === index ? 'opacity-100' : 'opacity-0'
              }`}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroFood;
