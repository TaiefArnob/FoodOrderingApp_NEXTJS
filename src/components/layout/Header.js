"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { MdLogout, MdLogin } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai"; // Professional cart icon
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const firstName = session?.user?.name?.split(" ")[0] || "User";

  const { cart = [] } = useCart() || {};

  return (
    <header className="bg-[#1a0000] shadow-md sticky top-0 z-50 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center drop-shadow-md"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Pipra Kitchen Logo"
            width={140}
            height={96}
            className="rounded-full object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-6 font-semibold text-amber-100 text-base">
          {navLinks.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="hover:text-amber-400 transition duration-200"
            >
              {name}
            </Link>
          ))}

          {/* ✅ My Orders link - only visible when logged in */}
          {isLoggedIn && (
            <Link
              href="/orders"
              className="hover:text-amber-400 transition duration-200"
            >
              My Orders
            </Link>
          )}
        </nav>

        {/* Desktop Auth + Cart */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart */}
          {isLoggedIn && !session?.user?.admin && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center text-amber-100 hover:text-amber-400 transition"
            >
              <AiOutlineShoppingCart size={28} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {/* User Profile + Logout */}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {session?.user?.profileImage ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400">
                    <Image
                      src={session.user.profileImage}
                      alt={firstName}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <FaUserCircle className="text-amber-400 text-3xl" />
                )}
                <span className="text-amber-100 font-medium">{firstName}</span>
              </Link>

              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-[#4b0000] px-4 py-1.5 rounded-full shadow-lg transition text-sm"
              >
                <MdLogout size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-amber-400 hover:text-amber-500 font-semibold transition text-sm"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-[#4b0000] px-5 py-1.5 rounded-full shadow-lg transition text-sm"
              >
                <MdLogin size={20} />
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-amber-100 text-3xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#1a0000] px-4 pb-4 space-y-2 text-amber-100 font-semibold text-base rounded-b-lg">
          {navLinks.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="block py-2 border-b border-amber-400 hover:text-amber-300 transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              {name}
            </Link>
          ))}

          {/* ✅ My Orders link in mobile */}
          {isLoggedIn && (
            <Link
              href="/orders"
              className="block py-2 border-b border-amber-400 hover:text-amber-300 transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Orders
            </Link>
          )}

          {isLoggedIn ? (
            <>
              {/* Cart in Mobile */}
              {!session?.user?.admin && (
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 relative bg-amber-400 text-[#4b0000] py-1.5 rounded-full shadow-md hover:bg-amber-500 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AiOutlineShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                  <span>Cart</span>
                </Link>
              )}

              <Link
                href="/profile"
                className="flex items-center gap-2 px-2 hover:opacity-80 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {session?.user?.profileImage ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400">
                    <Image
                      src={session.user.profileImage}
                      alt={firstName}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <FaUserCircle className="text-amber-400 text-2xl" />
                )}
                <span>{firstName}</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="flex items-center justify-center gap-1 w-full bg-amber-400 hover:bg-amber-500 text-[#4b0000] px-5 py-1.5 rounded-full shadow-md transition text-sm"
              >
                <MdLogout size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="block text-center text-amber-400 hover:text-amber-500 font-semibold transition text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-1 w-full bg-amber-400 hover:bg-amber-500 text-[#4b0000] px-5 py-1.5 rounded-full shadow-md transition text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdLogin size={20} />
                Login
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
