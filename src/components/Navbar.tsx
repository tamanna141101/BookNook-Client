"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e4d9] bg-[#fffdf7]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-[#244b3b] p-2 text-white">
            <BookOpen size={23} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#244b3b]">
            Book<span className="text-[#d58a42]">Nook</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-gray-600 transition hover:text-[#d58a42]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-[#244b3b] transition hover:bg-[#edf2ed]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-[#244b3b] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#18382b]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#244b3b] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#e8e4d9] bg-[#fffdf7] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-gray-700 hover:text-[#d58a42]"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-[#e8e4d9]" />

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="font-bold text-[#244b3b]"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="w-fit rounded-full bg-[#244b3b] px-5 py-2.5 font-bold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;