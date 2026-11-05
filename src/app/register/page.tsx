
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
      toast.error(
        "Password needs uppercase, lowercase and at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: photo.trim() || undefined,
      });

      if (result.error) {
        throw new Error(result.error.message || "Registration failed");
      }

      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        throw new Error(result.error.message || "Google registration failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google registration failed"
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#e8e4d9] bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#244b3b] text-white">
            <BookOpen size={29} />
          </div>

          <h1 className="text-3xl font-extrabold text-[#244b3b]">
            Join BookNook
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your account and explore a world of books.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#244b3b]">
              <User size={19} className="text-gray-400" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-transparent py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#244b3b]">
              <Mail size={19} className="text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-transparent py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Photo URL (Optional)
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#244b3b]">
              <ImageIcon size={19} className="text-gray-400" />
              <input
                type="url"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-transparent py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#244b3b]">
              <Lock size={19} className="text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Include uppercase and lowercase letters.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#244b3b]">
              <Lock size={19} className="text-gray-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-transparent py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#244b3b] py-3.5 font-bold text-white transition hover:bg-[#18382b] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={19} />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          <span className="text-lg font-bold">G</span>
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#244b3b] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
