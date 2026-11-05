
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const profileImage =
    !imageFailed &&
    typeof user?.image === "string" &&
    user.image.trim().length > 0;

  useEffect(() => {
    setImageFailed(false);
  }, [user?.image]);

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      closeMenus();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const Avatar = ({ size = "h-10 w-10" }: { size?: string }) => (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#244b3b]`}
    >
      {profileImage ? (
        <img
          src={user?.image || ""}
          alt="Profile"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </span>
      )}
    </div>
  );

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
  ];

  const privateLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  const navLinkClass =
    "text-sm font-medium text-gray-600 transition-colors hover:text-emerald-700";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex items-center gap-2"
        >
          <div className="rounded-lg bg-emerald-800 p-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>

          <span className="text-xl font-bold text-gray-900">
            Book<span className="text-emerald-700">Nook</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass}
            >
              {link.name}
            </Link>
          ))}

          {!isPending &&
            user &&
            privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass}
              >
                {link.name}
              </Link>
            ))}
        </div>

        {/* Desktop Authentication */}
        <div className="relative hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5 pr-3 hover:bg-gray-50"
              >
                <Avatar />

                <span className="max-w-32 truncate text-sm font-semibold text-gray-700">
                  {user.name || "User"}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">

                  <div className="flex items-center gap-3 border-b border-gray-100 px-2 pb-3">
                    <Avatar size="h-11 w-11" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name || "User"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={closeMenus}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">

            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={navLinkClass}
              >
                {link.name}
              </Link>
            ))}

            {!isPending &&
              user &&
              privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={navLinkClass}
                >
                  {link.name}
                </Link>
              ))}

            <div className="border-t border-gray-200 pt-4">
              {isPending ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : user ? (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name || "User"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={closeMenus}
                    className="mb-2 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenus}
                    className="flex-1 rounded-lg border border-emerald-800 py-2 text-center text-sm font-semibold text-emerald-800"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="flex-1 rounded-lg bg-emerald-800 py-2 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
