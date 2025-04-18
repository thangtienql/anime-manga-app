"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "../ui/ThemeSwitch";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for dark mode

  const navItems = [
    { label: "Anime", href: "/" },
    { label: "Manga", href: "/manga" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Github", href: "https://github.com/thangtienql/anime-manga-app.git", target: "_blank" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-999 ${isDarkMode ? 'dark-navbar' : ''}`}>
      <style jsx>{`
        .dark-navbar {
          background-color: rgb(17 24 39);
        }
      `}</style>
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          AnimeHub
        </Link>

        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                target={item.target}
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-md font-medium ${
                  pathname === item.href
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <ThemeSwitch />

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 