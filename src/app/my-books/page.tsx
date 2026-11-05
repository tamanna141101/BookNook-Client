
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Library,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Book {
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
  createdAt?: string;
}

interface EditForm {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const emptyEditForm: EditForm = {
  title: "",
  author: "",
  category: "Fiction",
  image: "",
  description: "",
  totalCopies: 1,
};

export default function MyBooksPage() {
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const email = session?.user?.email || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [saving, setSaving] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load books belonging to the logged-in user
  const loadMyBooks = useCallback(async (ownerEmail: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Failed to load books.");
      }

      const data = await response.json();

      const allBooks: Book[] = Array.isArray(data)
        ? data
        : Array.isArray(data.books)
          ? data.books
          : [];

      const myBooks = allBooks.filter(
        (book) =>
          book.userEmail?.toLowerCase() === ownerEmail.toLowerCase()
      );

      setBooks(myBooks);
    } catch (err) {
      console.error(err);
      setError("Could not load your books. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionPending) return;

    if (email) {
      loadMyBooks(email);
    } else {
      setBooks([]);
      setLoading(false);
    }
  }, [sessionPending, email, loadMyBooks]);

  // Search and category filter
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  // Open edit form
  const handleEdit = (book: Book) => {
    setEditingBook(book);

    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: book.totalCopies,
    });

    setError("");
    setSuccess("");
  };

  // Update form fields
  const handleEditChange = (
    field: keyof EditForm,
    value: string | number
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update book
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBook || !email) return;

    if (
      !editForm.title.trim() ||
      !editForm.author.trim() ||
      !editForm.image.trim() ||
      !editForm.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      !Number.isInteger(editForm.totalCopies) ||
      editForm.totalCopies < 1
    ) {
      setError("Total copies must be at least 1.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editForm,
            userEmail: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book.");
      }

      setEditingBook(null);
      setEditForm(emptyEditForm);
      setSuccess("Book updated successfully!");

      await loadMyBooks(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete book
  const handleDelete = async () => {
    if (!selectedBook || !email) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/books/${selectedBook._id}`,
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

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book.");
      }

      setSelectedBook(null);
      setSuccess("Book deleted successfully!");

      await loadMyBooks(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Session loading
  if (sessionPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-700" />
      </div>
    );
  }

  // Login required
  if (!email) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf8] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <BookOpen className="mx-auto mb-5 h-14 w-14 text-emerald-700" />

          <h1 className="text-2xl font-bold text-gray-900">
            Please Login First
          </h1>

          <p className="my-4 text-gray-600">
            Login to view and manage the books you have added.
          </p>

          <Link
            href="/login"
            className="inline-block rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white hover:bg-emerald-900"
          >
            Login Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-emerald-800">
              <Library size={22} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Your Collection
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              My Books
            </h1>

            <p className="mt-2 text-gray-600">
              Manage the books you have added to BookNook.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-900"
          >
            <Plus size={19} />
            Add New Book
          </Link>
        </div>

        {/* Account Information */}
        <div className="mb-7 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Logged in as
          </p>
          <p className="mt-1 break-all font-semibold text-gray-900">
            {email}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={19} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by book title or author..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-emerald-700"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Book Count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Your Collection ({filteredBooks.length})
          </h2>

          <button
            onClick={() => loadMyBooks(email)}
            className="text-sm font-semibold text-emerald-800 hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-700" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h3 className="text-xl font-bold text-gray-900">
              {books.length === 0
                ? "No Books Added Yet"
                : "No Matching Books Found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {books.length === 0
                ? "You haven't added any books to your collection yet."
                : "Try changing your search or category filter."}
            </p>

            {books.length === 0 && (
              <Link
                href="/add-book"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900"
              >
                <Plus size={18} />
                Add Your First Book
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-52 overflow-hidden bg-gray-100">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={50} className="text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {book.category}
                    </span>

                    <span className="text-xs text-gray-500">
                      {book.availableCopies} / {book.totalCopies} available
                    </span>
                  </div>

                  <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    by {book.author}
                  </p>

                  <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-6 text-gray-600">
                    {book.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEdit(book)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-emerald-700 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => setSelectedBook(book)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Book
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your book information.
                </p>
              </div>

              <button
                onClick={() => setEditingBook(null)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit form"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Book Title
                  </label>
                  <input
                    required
                    value={editForm.title}
                    onChange={(e) =>
                      handleEditChange("title", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Author
                  </label>
                  <input
                    required
                    value={editForm.author}
                    onChange={(e) =>
                      handleEditChange("author", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      handleEditChange("category", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Total Copies
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    step={1}
                    value={editForm.totalCopies}
                    onChange={(e) =>
                      handleEditChange(
                        "totalCopies",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Book Image URL
                </label>
                <input
                  required
                  type="url"
                  value={editForm.image}
                  onChange={(e) =>
                    handleEditChange("image", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={27} className="text-red-600" />
            </div>

            <h2 className="text-center text-xl font-bold text-gray-900">
              Delete This Book?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{selectedBook.title}</strong>? This action cannot be
              undone.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedBook(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
