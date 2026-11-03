
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ArrowRight,
  Loader2,
  BookX,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "All") {
          params.set("category", category);
        }

        const response = await fetch(
          `${API_URL}/books?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Something went wrong");
        }

        setBooks(data.books || []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, [search, category]);

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-emerald-600">
            Explore Our Collection
          </p>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Discover All Books
          </h1>

          <p className="mx-auto max-w-2xl text-gray-600">
            Explore our collection of books, discover new stories
            and find your next favorite read.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 shadow-sm focus-within:border-emerald-500">
            <Search className="h-5 w-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search by book title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent px-3 py-4 text-gray-700 outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === item
                  ? "bg-emerald-600 text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-500 hover:text-emerald-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Book Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {category === "All" ? "All Books" : category + " Books"}
          </h2>

          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `${books.length} books found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={() => {
                setSearch((value) => value + " ");
                setSearch((value) => value.trim());
              }}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <BookX className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h3 className="mb-2 text-xl font-bold text-gray-800">
              No Books Found
            </h3>

            <p className="text-gray-500">
              Try another search keyword or category.
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Book Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    {book.category}
                  </span>
                </div>

                {/* Book Information */}
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900">
                    {book.title}
                  </h3>

                  <p className="mb-4 text-sm text-gray-500">
                    By {book.author}
                  </p>

                  <div className="mb-5 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Total: {book.totalCopies}
                    </span>

                    <span
                      className={`font-semibold ${
                        book.availableCopies > 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies} Available`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <Link
                    href={`/books/${book._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
