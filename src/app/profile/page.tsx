
"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { UserRound, Mail, ArrowLeft, BookOpen } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [imageFailed, setImageFailed] = useState(false);

  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-[#244b3b]">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <UserRound size={45} className="text-[#244b3b]" />
        <h1 className="text-2xl font-bold text-[#244b3b]">
          Please Login First
        </h1>
        <Link href="/login" className="rounded-full bg-[#244b3b] px-6 py-3 font-semibold text-white">
          Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-[75vh] bg-[#f8f7f0] px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 font-semibold text-[#244b3b] hover:text-[#d58a42]"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-3xl border border-[#e8e4d9] bg-white shadow-sm">
          <div className="bg-[#244b3b] px-6 py-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#d58a42] text-4xl font-bold">
              {user.image && !imageFailed ? (
                <img
                  src={user.image}
                  alt="Profile"
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <h1 className="text-2xl font-extrabold">
              {user.name || "BookNook User"}
            </h1>
            <p className="mt-1 text-sm text-white/80">BookNook Member</p>
          </div>

          <div className="p-6 sm:p-9">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#244b3b]">
              <BookOpen size={22} />
              Personal Information
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl bg-[#f4f7f2] p-4">
                <div className="rounded-lg bg-white p-3 text-[#244b3b]">
                  <UserRound size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Full Name
                  </p>
                  <p className="break-words font-bold text-gray-800">
                    {user.name || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-[#f4f7f2] p-4">
                <div className="rounded-lg bg-white p-3 text-[#244b3b]">
                  <Mail size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Email Address
                  </p>
                  <p className="break-all font-bold text-gray-800">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-sm text-gray-500">
              Welcome to BookNook! Happy Reading.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
