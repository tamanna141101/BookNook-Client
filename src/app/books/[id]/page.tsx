
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  User,
  Tag,
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
  userName?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Book Details Content
function BookDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/books/${id}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Book not found");
        }

        setBook(data.book);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => controller.abort();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Error State
  if (error || !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf9] px-4 text-center">
        <BookOpen className="mb-4 h-16 w-16 text-gray-300" />

        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Book Not Found
        </h2>

        <p className="mb-6 text-gray-500">
          {error || "Sorry, this book could not be found."}
        </p>

        <Link
          href="/books"
          className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Back to All Books
        </Link>
      </div>
    );
  }

  // Book Details UI
  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft size={20} />
          Back to All Books
        </Link>

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2">

          {/* Book Image */}
          <div className="flex min-h-[400px] items-center justify-center bg-gray-100 p-8">
            <img
              src={book.image}
              alt={book.title}
              className="max-h-[480px] w-full rounded-xl object-contain"
            />
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center p-6 sm:p-10">

            <span className="mb-4 w-fit rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              {book.category}
            </span>

            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {book.title}
            </h1>

            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <User size={18} />
              <span>By {book.author}</span>
            </div>

            {/* Description */}
            <div className="mb-6 border-y border-gray-100 py-5">
              <h3 className="mb-3 text-lg font-bold text-gray-800">
                About This Book
              </h3>

              <p className="leading-7 text-gray-600">
                {book.description}
              </p>
            </div>

            {/* Book Copies */}
            <div className="mb-8 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <BookOpen size={18} />
                  <span className="text-sm">Total Copies</span>
                </div>

                <p className="text-2xl font-bold text-gray-900">
                  {book.totalCopies}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <Tag size={18} />
                  <span className="text-sm">Available</span>
                </div>

                <p
                  className={`text-2xl font-bold ${
                    book.availableCopies > 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {book.availableCopies}
                </p>
              </div>

            </div>

            {/* Borrow Button */}
            {book.availableCopies > 0 ? (
              <Link
                href={`/login?redirect=/books/${book._id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
              >
                <BookOpen size={20} />
                Borrow This Book
              </Link>
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-gray-300 px-6 py-4 font-bold text-gray-600"
              >
                Currently Unavailable
              </button>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// Main Page with Suspense
export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
