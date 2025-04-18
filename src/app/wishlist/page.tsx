"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { wishlistStore, WishlistItem } from "../../lib/wishlistStore";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "anime" | "manga">("all");

  // Avoid hydration mismatch and subscribe to changes
  useEffect(() => {
    setMounted(true);
    setItems(wishlistStore.getItems());
    
    // Subscribe to changes
    const unsubscribe = wishlistStore.subscribe((updatedItems) => {
      setItems(updatedItems);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  // Filter items based on active tab
  const filteredItems = activeTab === "all"
    ? items
    : items.filter((item) => item.type === activeTab);

  // Group items by type for the stats
  const animeCount = items.filter((item) => item.type === "anime").length;
  const mangaCount = items.filter((item) => item.type === "manga").length;

  const handleRemoveItem = (id: number, type: 'anime' | 'manga') => {
    wishlistStore.removeFromWishlist(id, type);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {/* Stats summary */}
      <div className="flex gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex-1 text-center">
          <p className="text-2xl font-bold">{items.length}</p>
          <p className="text-gray-600 dark:text-gray-400">Total Items</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex-1 text-center">
          <p className="text-2xl font-bold">{animeCount}</p>
          <p className="text-gray-600 dark:text-gray-400">Anime</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex-1 text-center">
          <p className="text-2xl font-bold">{mangaCount}</p>
          <p className="text-gray-600 dark:text-gray-400">Manga</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("anime")}
            className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "anime"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Anime ({animeCount})
          </button>
          <button
            onClick={() => setActiveTab("manga")}
            className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "manga"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Manga ({mangaCount})
          </button>
        </nav>
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add anime or manga to your wishlist to keep track of what you want to watch or read next.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/anime"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Explore Anime
            </Link>
            <Link
              href="/manga"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Explore Manga
            </Link>
          </div>
        </div>
      )}

      {/* Wishlist grid */}
      {filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={`${item.type}-${item.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col"
            >
              <div className="relative h-[200px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleRemoveItem(item.id, item.type)}
                    className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    aria-label="Remove from wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium capitalize">
                  {item.type}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <Link 
                  href={`/${item.type}/${item.id}`} 
                  className="hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">{item.title}</h3>
                </Link>
                <div className="mt-auto text-xs text-gray-600 dark:text-gray-400">
                  Added on {formatDate(item.addedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 