
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { BookPlus, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const labelStyle = "mb-2 block font-semibold text-gray-800";

export default function AddBookPage() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: "1",
    userName: "",
    userEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const copies = Number(form.totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      setError("Total copies must be a positive whole number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          totalCopies: copies,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add book.");
      }

      setMessage("Book added successfully!");

      setForm({
        title: "",
        author: "",
        category: "Fiction",
        image: "",
        description: "",
        totalCopies: "1",
        userName: "",
        userEmail: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f5f3] px-4 py-12">
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8"
        >
          {/* Success Message */}
          {message && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle size={20} />
              <span className="font-medium">{message}</span>

              <Link
                href="/books"
                className="ml-auto font-semibold underline"
              >
                View Books
              </Link>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

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
                  <option
                    key={category}
                    value={category}
                    className="bg-white text-gray-900"
                  >
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

          {/* Owner Information */}
          <div className="border-t border-gray-200 pt-5">
            <h2 className="mb-2 text-lg font-bold text-gray-950">
              Owner Information
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              Temporary fields until login and registration are connected.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelStyle}>Your Name *</label>
                <input
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Your Email *</label>
                <input
                  type="email"
                  name="userEmail"
                  value={form.userEmail}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className={inputStyle}
                />
              </div>
            </div>
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
      </div>
    </main>
  );
}
