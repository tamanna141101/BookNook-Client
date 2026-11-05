
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookPlus,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const labelStyle = "mb-2 block font-semibold text-gray-800";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: "1",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const user = session?.user;

  const showToast = (
    type: "success" | "error",
    message: string
  ) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.email) {
      showToast("error", "Please login before adding a book.");
      return;
    }

    const copies = Number(form.totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      showToast("error", "Total copies must be a positive whole number.");
      return;
    }

    try {
      setLoading(true);
      setToast(null);

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          totalCopies: copies,
          userName: user.name || "BookNook User",
          userEmail: user.email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add book.");
      }

      setForm({
        title: "",
        author: "",
        category: "Fiction",
        image: "",
        description: "",
        totalCopies: "1",
      });

      showToast("success", "Book added successfully!");
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f5f3]">
        <Loader2 className="animate-spin text-emerald-700" size={36} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f5f3] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
          <BookPlus className="mx-auto mb-4 text-emerald-700" size={48} />
          <h1 className="text-2xl font-bold text-gray-950">
            Login Required
          </h1>
          <p className="my-4 text-gray-600">
            Please login to your BookNook account before adding a book.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            Login Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f5f3] px-4 py-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed right-4 top-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border p-4 shadow-lg ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {toast.type === "success" ? (
            <CheckCircle size={22} className="shrink-0" />
          ) : (
            <AlertCircle size={22} className="shrink-0" />
          )}

          <span className="flex-1 font-medium">{toast.message}</span>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <BookPlus size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-950">
            Add a New Book
          </h1>

          <p className="mt-2 text-gray-700">
            Share your favorite books with the BookNook community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8"
        >
          {/* Book Information */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelStyle}>Book Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Author Name *</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputStyle}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Total Copies *</label>
              <input
                type="number"
                name="totalCopies"
                value={form.totalCopies}
                onChange={handleChange}
                min="1"
                step="1"
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className={labelStyle}>Book Image URL *</label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/book-image.jpg"
              required
              className={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelStyle}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short description about the book..."
              rows={5}
              required
              className={inputStyle}
            />
          </div>

          {/* Logged-in User Information */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <h2 className="mb-2 font-bold text-gray-900">
              Book Owner
            </h2>

            <p className="text-sm text-gray-700">
              <span className="font-semibold">Name:</span>{" "}
              {user.name || "BookNook User"}
            </p>

            <p className="mt-1 text-sm text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {user.email}
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Your account information is automatically added as the book owner.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Adding Book...
              </>
            ) : (
              <>
                <BookPlus size={20} />
                Add Book
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            href="/books"
            className="font-semibold text-emerald-700 hover:underline"
          >
            View All Books →
          </Link>
        </div>
      </div>
    </main>
  );
}
