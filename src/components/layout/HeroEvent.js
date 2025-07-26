'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const eventImages = ['/ev1.jpg', '/ev2.jpg', '/ev3.jpg', '/ev4.jpg'];
const messages = [
  'For booking, call our hotline: 01234-567890',
  'Celebrate your special day with us!',
  'Book your rooftop event now!',
];

const HeroEvent = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  // Rotate images
  useEffect(() => {
    const imgInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % eventImages.length);
    }, 4000);
    return () => clearInterval(imgInterval);
  }, []);

  // Rotate messages
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-16 bg-white">
      {/* Image Left */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-[300px] h-[350px] md:w-[480px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border-4 border-yellow-200">
          {eventImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Event ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                currentImage === index ? 'opacity-100' : 'opacity-0'
              }`}
              priority={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Text Right */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          <span className="block">Celebrate</span>
          <span className="block text-yellow-600">In Style</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700">
          Host unforgettable rooftop events at <strong>Pipra Kitchen</strong> — from birthdays to engagements or corporate evenings, we’ve got you covered.
        </p>

        <div className="mt-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md shadow-md text-base md:text-lg font-medium h-12 flex items-center justify-center transition-all duration-500">
          {messages[currentMessage]}
        </div>
      </div>
    </section>
  );
};

export default HeroEvent;
