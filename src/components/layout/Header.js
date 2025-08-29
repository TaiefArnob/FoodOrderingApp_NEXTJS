"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { MdLogout, MdLogin } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

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

        {/* Desktop Center Nav */}
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
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Profile Picture + Name -> Link to Profile */}
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {session?.user?.profileImage ? (
                  <Image
                    src={session.user.profileImage}
                    alt={firstName}
                    width={36}
                    height={36}
                    className="rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <FaUserCircle className="text-amber-400 text-3xl" />
                )}
                <span className="text-amber-100 font-medium">
                  {firstName}
                </span>
              </Link>

              {/* Logout */}
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

      {/* Mobile Nav Menu */}
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

          {isLoggedIn ? (
            <>
              {/* Profile Link in Mobile */}
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2 hover:opacity-80 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {session?.user?.profileImage ? (
                  <Image
                    src={session.user.profileImage}
                    alt={firstName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border border-amber-400"
                  />
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
