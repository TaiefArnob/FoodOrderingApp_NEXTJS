"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1a0000] text-amber-100 pt-10 pb-6 px-4 md:px-10 lg:px-20 rounded-t-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-amber-700 pb-8">
        {/* Logo & Description */}
        <div>
          <Link href="/" className="flex items-center mb-4">
            <Image
              src="/logo.png"
              alt="Pipra Kitchen Logo"
              width={120}
              height={80}
              className="rounded-full object-contain"
            />
          </Link>
          <p className="text-sm text-amber-200">
            Pipra Kitchen brings you the authentic taste of tradition with every
            bite. Fresh ingredients, handcrafted recipes, and a cozy experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-amber-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-amber-400 transition">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-amber-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-400 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1" /> Northern Front Road, Dhaka,
              Bangladesh
            </li>
            <li className="flex items-start gap-2">
              <FaPhoneAlt className="mt-1" /> +8801682926129
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope className="mt-1" /> support@piprakitchen.com
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-amber-400"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-amber-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className="hover:text-amber-400"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm mt-6 text-amber-300">
        © {new Date().getFullYear()} Pipra Kitchen. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
