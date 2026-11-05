
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Login failed");
      }

      toast.success("Welcome back to BookNook!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        throw new Error(result.error.message || "Google login failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google login failed"
      );
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#e8e4d9] bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#244b3b] text-white">
            <BookOpen size={29} />
          </div>

          <h1 className="text-3xl font-extrabold text-[#244b3b]">
            Welcome Back!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue your BookNook journey.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="w-full bg-transparent py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() =>
                toast("Please contact support for password assistance.")
              }
              className="text-sm font-semibold text-[#244b3b] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#244b3b] py-3.5 font-bold text-white transition hover:bg-[#18382b] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={19} />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 size={19} className="animate-spin" />
          ) : (
            <span className="font-bold text-lg">G</span>
          )}
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#244b3b] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
