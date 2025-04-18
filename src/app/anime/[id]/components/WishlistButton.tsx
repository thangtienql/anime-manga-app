"use client";

import { useState, useEffect } from "react";
import { wishlistStore } from "@/lib/wishlistStore";
import { Anime } from "@/lib/api";

interface WishlistButtonProps {
  anime: Anime;
  animeId: number;
}

export default function WishlistButton({ anime, animeId }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    // Initialize wishlist state
    setInWishlist(wishlistStore.isInWishlist(animeId, "anime"));

    // Listen for changes
    const unsubscribe = wishlistStore.subscribe(() => {
      setInWishlist(wishlistStore.isInWishlist(animeId, "anime"));
    });

    return () => unsubscribe();
  }, [animeId]);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      wishlistStore.removeFromWishlist(animeId, "anime");
    } else {
      wishlistStore.addToWishlist(anime, "anime");
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
        inWishlist
          ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={inWishlist ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
} 