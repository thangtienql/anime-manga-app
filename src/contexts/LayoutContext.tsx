'use client '

import Navbar from "@/components/layout/Navbar"
import { ThemeProvider } from "./ThemeContext"
import RateLimitIndicator from "@/components/RateLimitIndicator"

export default function LayoutContext({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AnimeHub. Powered by Jikan API.
          </div>
        </footer>
        <RateLimitIndicator />
      </div>
    </ThemeProvider>
  )
}


