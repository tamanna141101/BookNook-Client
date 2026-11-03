import Link from "next/link";
import { BookOpen, Mail, MapPin, Globe, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#19382c] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">

        {/* Brand */}
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <div className="rounded-xl bg-white/10 p-2">
              <BookOpen size={25} />
            </div>

            <span className="text-2xl font-extrabold">
              Book<span className="text-[#e8a65d]">Nook</span>
            </span>
          </Link>

          <p className="mt-3 max-w-sm text-sm leading-7 text-gray-300">
            Discover your next favorite book. Explore stories, share knowledge,
            and build your own little reading corner with BookNook.
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href="mailto:hello@booknook.com"
              aria-label="Email"
              className="rounded-full bg-white/10 p-2.5 transition hover:bg-[#d58a42]"
            >
              <Mail size={18} />
            </a>

            <a
              href="#"
              aria-label="Website"
              className="rounded-full bg-white/10 p-2.5 transition hover:bg-[#d58a42]"
            >
              <Globe size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Quick Links</h3>

          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <Link href="/" className="transition hover:text-[#e8a65d]">
              Home
            </Link>

            <Link href="/books" className="transition hover:text-[#e8a65d]">
              All Books
            </Link>

            <Link href="/add-book" className="transition hover:text-[#e8a65d]">
              Add a Book
            </Link>

            <Link href="/my-books" className="transition hover:text-[#e8a65d]">
              My Books
            </Link>

            <Link href="/my-borrows" className="transition hover:text-[#e8a65d]">
              My Borrows
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Contact Us</h3>

          <div className="flex flex-col gap-4 text-sm text-gray-300">
            <p className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-[#e8a65d]" />
              hello@booknook.com
            </p>

            <p className="flex items-center gap-3">
              <MapPin size={18} className="shrink-0 text-[#e8a65d]" />
              Bangladesh
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-gray-400">
        © 2026 BookNook. All rights reserved.
        <span className="mx-1">Made with</span>
        <Heart size={14} className="mx-1 inline text-[#e8a65d]" />
        for book lovers.
      </div>
    </footer>
  );
};

export default Footer;