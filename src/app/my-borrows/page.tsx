
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  RotateCcw,
  Loader2,
  AlertCircle,
  Library,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load saved email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("booknook_user_email");

    if (savedEmail) {
      const cleanEmail = savedEmail.trim().toLowerCase();

      setEmail(cleanEmail);
      setEmailInput(cleanEmail);
      fetchBorrows(cleanEmail);
    } else {
      setLoading(false);
    }

    setEmailChecked(true);
  }, []);

  // Fetch borrowed books
  const fetchBorrows = async (userEmail: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/borrows?userEmail=${encodeURIComponent(userEmail)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load borrowed books"
        );
      }

      setBorrows(data.borrows || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit email for first-time users
  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    localStorage.setItem("booknook_user_email", cleanEmail);

    setEmail(cleanEmail);
    setMessage("");
    fetchBorrows(cleanEmail);
  };

  // Return borrowed book
  const handleReturn = async (borrowId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) return;

    try {
      setReturningId(borrowId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/borrows/${borrowId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to return book"
        );
      }

      setBorrows((previous) =>
        previous.filter((borrow) => borrow._id !== borrowId)
      );

      setMessage("Book returned successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setReturningId("");
    }
  };

  // Change saved email
  const handleChangeEmail = () => {
    localStorage.removeItem("booknook_user_email");

    setEmail("");
    setEmailInput("");
    setBorrows([]);
    setError("");
    setMessage("");
  };

  // Format date
  const formatDate = (date: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Initial hydration/loading screen
  if (!emailChecked || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-emerald-600"
          />
          <p className="mt-3 text-gray-600">
            Loading your borrowed books...
          </p>
        </div>
      </div>
    );
  }

  // Email setup screen
  if (!email) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <BookOpen
            size={48}
            className="mx-auto mb-4 text-emerald-600"
          />

          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            My Borrowed Books
          </h1>

          <p className="mb-6 text-gray-600">
            Enter the email address you used when borrowing books.
          </p>

          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address"
              required
              className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {error && (
              <p className="mb-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Find My Borrowed Books
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Library
                size={28}
                className="text-emerald-600"
              />

              <h1 className="text-3xl font-bold text-gray-900">
                My Borrowed Books
              </h1>
            </div>

            <p className="text-gray-600">
              Manage your borrowed books and return them when finished.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Email: {email}
            </p>

            <button
              onClick={handleChangeEmail}
              className="mt-1 text-sm font-semibold text-emerald-700 underline"
            >
              Change Email
            </button>
          </div>

          <Link
            href="/books"
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Browse Books
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />
            <p>{error}</p>

            <button
              onClick={() => fetchBorrows(email)}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            {message}
          </div>
        )}

        {/* Borrow Count */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Currently Borrowed
          </p>

          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {borrows.length}
          </p>
        </div>

        {/* Empty State */}
        {borrows.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen
              size={60}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              No Borrowed Books!
            </h2>

            <p className="mb-6 text-gray-600">
              You have not borrowed any books yet.
            </p>

            <Link
              href="/books"
              className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Explore Books
            </Link>
          </div>
        ) : (

          /* Borrowed Books */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {borrows.map((borrow) => (
              <div
                key={borrow._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Book Image */}
                <div className="relative h-56 w-full bg-gray-100">
                  {borrow.bookImage ? (
                    <Image
                      src={borrow.bookImage}
                      alt={borrow.bookTitle}
                      fill
                      unoptimized
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen
                        size={55}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Book Information */}
                <div className="p-5">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    {borrow.bookTitle}
                  </h2>

                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays
                        size={17}
                        className="text-emerald-600"
                      />

                      <span>
                        Borrowed: {formatDate(borrow.borrowDate)}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays
                        size={17}
                        className="text-emerald-600"
                      />

                      <span>
                        Return Date: {formatDate(borrow.returnDate)}
                      </span>
                    </p>
                  </div>

                  {/* Return Button */}
                  <button
                    onClick={() => handleReturn(borrow._id)}
                    disabled={returningId === borrow._id}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {returningId === borrow._id ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Returning...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={18} />
                        Return Book
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
