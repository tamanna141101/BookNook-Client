
"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  BookOpen,
  Trash2,
  Pencil,
  Loader2,
  X,
  Save,
  Plus,
  Library,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
};

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export default function MyBooksPage() {
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: "1",
  });

  // Load owner's books automatically
  const loadMyBooks = async (ownerEmail: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load books.");
      }

      const myBooks = data.books.filter(
        (book: Book) =>
          book.userEmail?.toLowerCase() === ownerEmail.toLowerCase()
      );

      setBooks(myBooks);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get saved email from browser
  useEffect(() => {
    const savedEmail = localStorage.getItem("booknook_user_email");

    if (savedEmail) {
      setEmail(savedEmail);
      loadMyBooks(savedEmail);
    } else {
      setLoading(false);
      setSearched(false);
    }
  }, []);

  // First-time email setup
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ownerEmail = email.trim().toLowerCase();

    if (!ownerEmail) return;

    localStorage.setItem("booknook_user_email", ownerEmail);
    setEmail(ownerEmail);

    await loadMyBooks(ownerEmail);
  };

  // Delete book
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete book.");
      }

      setBooks((previous) =>
        previous.filter((book) => book._id !== id)
      );

      setSuccess("Book deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete book."
      );
    }
  };

  // Open edit form
  const handleEdit = (book: Book) => {
    setEditingBook(book);

    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: String(book.totalCopies),
    });

    setError("");
    setSuccess("");
  };

  // Update book
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBook) return;

    const copies = Number(editForm.totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      setError("Total copies must be a positive whole number.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editForm,
            totalCopies: copies,
            userEmail: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update book.");
      }

      await loadMyBooks(email);

      setEditingBook(null);
      setSuccess("Book updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update book."
      );
    } finally {
      setSaving(false);
    }
  };

  // Forget saved email
  const handleChangeEmail = () => {
    localStorage.removeItem("booknook_user_email");
    setEmail("");
    setBooks([]);
    setSearched(false);
    setError("");
    setSuccess("");
  };

  return (
    <main className="min-h-screen bg-[#f1f5f3] px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Library size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl">
            My Books
          </h1>

          <p className="mt-3 text-gray-600">
            View and manage all the books you've added to BookNook.
          </p>
        </div>

        {/* First time email setup */}
        {!email && !searched && !loading && (
          <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-gray-950">
              Find Your Books
            </h2>

            <p className="mb-5 text-sm text-gray-600">
              Enter your email address to view the books you've added to BookNook.
            </p>

            <form onSubmit={handleSearch} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className={inputStyle}
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                <BookOpen size={19} />
                Show My Books
              </button>
            </form>
          </div>
        )}

        {/* Account Information */}
        {email && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <p className="text-sm text-gray-500">
                Showing books for
              </p>
              <p className="font-semibold text-gray-900">{email}</p>
            </div>

            <button
              onClick={handleChangeEmail}
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              Change Email
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            {success}
          </div>
        )}

        {/* Edit Form */}
        {editingBook && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-950">
                Edit Book
              </h2>

              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Book title"
                  required
                  className={inputStyle}
                />

                <input
                  value={editForm.author}
                  onChange={(e) =>
                    setEditForm({ ...editForm, author: e.target.value })
                  }
                  placeholder="Author name"
                  required
                  className={inputStyle}
                />

                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className={inputStyle}
                >
                  {["Fiction", "Science", "History", "Kids", "Others"].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={editForm.totalCopies}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      totalCopies: e.target.value,
                    })
                  }
                  required
                  placeholder="Total copies"
                  className={inputStyle}
                />
              </div>

              <input
                type="url"
                value={editForm.image}
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.value })
                }
                placeholder="Book image URL"
                required
                className={inputStyle}
              />

              <textarea
                rows={4}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
                placeholder="Book description"
                required
                className={inputStyle}
              />

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              size={40}
              className="animate-spin text-emerald-700"
            />
            <p className="mt-4 text-gray-600">Loading your books...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && searched && books.length === 0 && !error && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen
              size={55}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-2xl font-bold text-gray-950">
              No Books Yet!
            </h2>

            <p className="mt-3 text-gray-600">
                You haven't added any books to BookNook yet. Start building your collection now!
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              <Plus size={20} />
              Add New Book
            </Link>
          </div>
        )}

        {/* Books List */}
        {!loading && searched && books.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Your Collection
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {books.length} {books.length === 1 ? "book" : "books"} added
                </p>
              </div>

              <Link
                href="/add-book"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
              >
                <Plus size={19} />
                Add Book
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-64 w-full bg-gray-100 object-cover"
                  />

                  <div className="p-5">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {book.category}
                    </span>

                    <h3 className="mt-3 text-xl font-bold text-gray-950">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      By {book.author}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Total Copies</p>
                        <p className="mt-1 font-bold text-gray-900">
                          {book.totalCopies}
                        </p>
                      </div>

                      <div className="rounded-lg bg-emerald-50 p-3">
                        <p className="text-xs text-emerald-700">
                          Available
                        </p>
                        <p className="mt-1 font-bold text-emerald-800">
                          {book.availableCopies}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleEdit(book)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Pencil size={17} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(book._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
