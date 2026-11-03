
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
  CalendarDays,
  Mail,
  CheckCircle,
  AlertCircle,
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

// Get tomorrow's date in local YYYY-MM-DD format
function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function BookDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch book details
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
        });

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

  // Load saved user email
  useEffect(() => {
    const savedEmail = localStorage.getItem("booknook_user_email");

    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  // Open borrow form
  const handleOpenBorrowForm = () => {
    setError("");
    setMessage("");
    setShowBorrowForm(true);
  };

  // Borrow book
  const handleBorrow = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!book) return;

    const cleanName = userName.trim();
    const cleanEmail = userEmail.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !returnDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (book.availableCopies < 1) {
      setError("Sorry! This book is currently out of stock.");
      return;
    }

    if (new Date(returnDate) <= new Date(new Date().toDateString())) {
      setError("Please select a future return date.");
      return;
    }

    try {
      setBorrowing(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          userEmail: cleanEmail,
          userName: cleanName,
          returnDate,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to borrow book");
      }

      // Save email for My Books and My Borrows pages
      localStorage.setItem("booknook_user_email", cleanEmail);

      // Update available copies immediately
      setBook((previous) =>
        previous
          ? {
              ...previous,
              availableCopies: Math.max(
                0,
                previous.availableCopies - 1
              ),
            }
          : null
      );

      setMessage("Book borrowed successfully!");
      setShowBorrowForm(false);
      setReturnDate("");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong";

      if (errorMessage === "No copies available for borrowing") {
        setError("Sorry! This book is currently out of stock.");
      } else if (
        errorMessage === "You have already borrowed this book"
      ) {
        setError("You have already borrowed this book.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setBorrowing(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Error screen
  if (error && !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf9] px-4 text-center">
        <BookOpen className="mb-4 h-16 w-16 text-gray-300" />

        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Book Not Found
        </h2>

        <p className="mb-6 text-gray-500">{error}</p>

        <Link
          href="/books"
          className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Back to All Books
        </Link>
      </div>
    );
  }

  if (!book) return null;

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
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="max-h-[480px] w-full rounded-xl object-contain"
              />
            ) : (
              <BookOpen size={100} className="text-gray-400" />
            )}
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

            {/* Copies */}
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

            {/* Success Message */}
            {message && (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-emerald-700">
                  <CheckCircle size={20} />
                  {message}
                </div>

                <Link
                  href="/my-borrows"
                  className="mt-2 inline-block text-sm font-semibold text-emerald-700 underline"
                >
                  View My Borrowed Books
                </Link>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* Borrow Button */}
            {book.availableCopies > 0 ? (
              <button
                type="button"
                onClick={handleOpenBorrowForm}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
              >
                <BookOpen size={20} />
                Borrow This Book
              </button>
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-gray-300 px-6 py-4 font-bold text-gray-600"
              >
                Out of Stock
              </button>
            )}

            {/* Borrow Form */}
            {showBorrowForm && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <h2 className="mb-2 text-xl font-bold text-gray-900">
                  Borrow This Book
                </h2>

                <p className="mb-5 text-sm text-gray-600">
                  Enter your information to borrow this book.
                </p>

                <form onSubmit={handleBorrow} className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Your Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Return Date
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={getTomorrowDate()}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="submit"
                      disabled={borrowing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {borrowing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Borrowing...
                        </>
                      ) : (
                        "Confirm Borrow"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowBorrowForm(false);
                        setError("");
                      }}
                      disabled={borrowing}
                      className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
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
