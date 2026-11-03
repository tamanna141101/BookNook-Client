"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BookMarked,
  Library,
  Sparkles,
  Search,
} from "lucide-react";

import dynamic from "next/dynamic";

const HeroSlider = dynamic(
  () => import("../components/HeroSlider"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[560px] items-center justify-center bg-[#244b3b] md:min-h-[650px]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    ),
  }
);

// Book Type
interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  availableCopies?: number;
  totalCopies?: number;
}

// API URL
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Book Categories
const categories = [
  {
    name: "Fiction",
    emoji: "📖",
    description: "Stories beyond imagination",
  },
  {
    name: "Science",
    emoji: "🔬",
    description: "Explore how the world works",
  },
  {
    name: "History",
    emoji: "🏛️",
    description: "Travel through time",
  },
  {
    name: "Kids",
    emoji: "🧸",
    description: "Little books, big adventures",
  },
  {
    name: "Others",
    emoji: "📚",
    description: "Something for everyone",
  },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Latest Books from MongoDB
  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/books?limit=6`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books from server.");
        }

        const result = await response.json();

        const bookList: Book[] = Array.isArray(result)
          ? result
          : result.books || result.data || result.result || [];

        // Show only latest 6 books
        setBooks(bookList.slice(0, 6));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Book fetching error:", err);

        setError(
          "Unable to load books. Please check your internet or server connection."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="bg-[#fffdf7]">

      {/* ================= HERO SLIDER ================= */}

      <section className="relative">
        <HeroSlider />
      </section>

      {/* ================= INTRODUCTION ================= */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

        <div className="grid items-center gap-10 md:grid-cols-2">

          <div>
            <span className="text-sm font-bold tracking-[0.2em] text-[#d58a42]">
              YOUR ONLINE LIBRARY
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#244b3b] md:text-4xl">
              More Than Books.
              <br />
              A World of Possibilities.
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              BookNook brings book lovers and great stories together.
              Explore different categories, discover interesting reads,
              and keep track of the books you love.
            </p>

            <Link
              href="/books"
              className="mt-7 inline-flex items-center gap-2 font-bold text-[#244b3b] transition hover:text-[#d58a42]"
            >
              Discover Our Library
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-3xl bg-[#e9eee6] p-8">
              <BookOpen size={35} className="text-[#244b3b]" />

              <h3 className="mt-5 text-2xl font-extrabold text-[#244b3b]">
                Explore
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Discover books from different genres.
              </p>
            </div>

            <div className="mt-10 rounded-3xl bg-[#f8ead8] p-8">
              <BookMarked size={35} className="text-[#b87535]" />

              <h3 className="mt-5 text-2xl font-extrabold text-[#244b3b]">
                Borrow
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Borrow books and enjoy reading.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= LATEST BOOKS ================= */}

      <section className="bg-[#f4f3ec] py-20">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-[#d58a42]">
                FRESH FROM OUR SHELVES
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-[#244b3b] md:text-4xl">
                Latest Arrivals
              </h2>

              <p className="mt-3 text-gray-600">
                Find your next favorite read from our newest collection.
              </p>
            </div>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-full border border-[#244b3b] px-5 py-3 text-sm font-bold text-[#244b3b] transition hover:bg-[#244b3b] hover:text-white"
            >
              See All Books
              <ArrowRight size={17} />
            </Link>

          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-56 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#dce6dc] border-t-[#244b3b]" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl bg-white p-10 text-center">

              <BookOpen
                size={45}
                className="mx-auto text-[#d58a42]"
              />

              <h3 className="mt-4 text-xl font-bold text-[#244b3b]">
                Something went wrong!
              </h3>

              <p className="mt-2 text-gray-500">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#244b3b] px-6 py-3 font-bold text-white transition hover:bg-[#19382c]"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Empty Books */}
          {!loading && !error && books.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center">

              <BookOpen
                size={45}
                className="mx-auto text-[#d58a42]"
              />

              <h3 className="mt-4 text-xl font-bold text-[#244b3b]">
                No Books Found Yet
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first book to see it here.
              </p>

              <Link
                href="/add-book"
                className="mt-5 inline-block rounded-full bg-[#244b3b] px-6 py-3 font-bold text-white"
              >
                Add a Book
              </Link>

            </div>
          )}

          {/* Book Cards */}
          {!loading && !error && books.length > 0 && (

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {books.map((book) => (

                <article
                  key={book._id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  {/* Book Image */}
                  <div className="relative h-64 overflow-hidden bg-[#e9eee6]">

                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen
                          size={60}
                          className="text-[#244b3b]"
                        />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-[#fffdf7] px-4 py-2 text-xs font-bold text-[#244b3b] shadow">
                      {book.category}
                    </span>

                  </div>

                  {/* Book Information */}
                  <div className="p-6">

                    <h3 className="line-clamp-1 text-xl font-bold text-[#244b3b]">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      By {book.author}
                    </p>

                    {book.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {book.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                      <span className="text-sm text-gray-500">
                        Available:{" "}
                        <strong className="text-[#244b3b]">
                          {book.availableCopies ?? "N/A"}
                        </strong>
                      </span>

                      <Link
                        href={`/books/${book._id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#b87535] transition hover:text-[#244b3b]"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>

                    </div>
                  </div>

                </article>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="mb-10 text-center">

          <span className="text-sm font-bold tracking-[0.2em] text-[#d58a42]">
            FIND YOUR INTEREST
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-[#244b3b] md:text-4xl">
            Browse by Category
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Whatever you love reading, there is a category waiting for you.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={`/books?category=${category.name}`}
              className="rounded-2xl border border-[#e8e4d9] bg-white p-7 text-center transition hover:-translate-y-2 hover:border-[#d58a42] hover:shadow-lg"
            >

              <span className="text-4xl">
                {category.emoji}
              </span>

              <h3 className="mt-4 text-lg font-extrabold text-[#244b3b]">
                {category.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {category.description}
              </p>

            </Link>

          ))}

        </div>
      </section>

      {/* ================= READING COMMUNITY ================= */}

      <section className="px-5 pb-20 lg:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#244b3b] px-7 py-16 text-center md:px-16">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#f2b978]">
            <Library size={32} />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold text-white md:text-4xl">
            Your Next Favorite Book Is Waiting for You
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-200">
            Join the BookNook reading community. Explore our collection,
            share your books, and make every reading moment special.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e6a45d] px-7 py-4 font-bold text-[#19382c] transition hover:-translate-y-1 hover:bg-[#f2b978]"
          >
            Join BookNook
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </main>
  );
}