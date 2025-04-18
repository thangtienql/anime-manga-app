"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Anime, Manga } from "@/lib/api";
import { wishlistStore } from "@/lib/wishlistStore";

type MediaType = "anime" | "manga";

interface MediaCardProps {
  media: Anime | Manga;
  mediaType: MediaType;
}

export default function MediaCard({ media, mediaType }: MediaCardProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Initialize with current state
    setInWishlist(wishlistStore.isInWishlist(media.mal_id, mediaType));
    
    // Subscribe to changes
    const unsubscribe = wishlistStore.subscribe(() => {
      setInWishlist(wishlistStore.isInWishlist(media.mal_id, mediaType));
    });
    
    return () => unsubscribe();
  }, [media.mal_id, mediaType]);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      wishlistStore.removeFromWishlist(media.mal_id, mediaType);
    } else {
      wishlistStore.addToWishlist(media, mediaType);
    }
  };

  // Determine count label (episodes for anime, chapters for manga)
  const getCountLabel = () => {
    if (mediaType === "anime" && "episodes" in media && media.episodes) {
      return `${media.episodes} eps`;
    } else if (mediaType === "manga" && "chapters" in media && media.chapters) {
      return `${media.chapters} chapters`;
    }
    return null;
  };

  return (
    <Link href={`/${mediaType}/${media.mal_id}`} className="hover:text-blue-600 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        <div className="relative h-[200px] bg-gray-200 dark:bg-gray-700">
          {!imageError ? (
            <>
              <div 
                className={`absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              >
                <svg className="w-8 h-8 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <Image
                src={media.images.jpg.image_url}
                alt={media.title}
                fill
                className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <div className="text-center p-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Image not available</p>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 rounded-full ${
                inWishlist 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>
          {media.score && !imageError && (
            <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium z-10">
              ★ {media.score.toFixed(1)}
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{media.title}</h3>
          
          <div className="mt-auto flex flex-wrap gap-2 text-xs pt-2">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
              {media.type || "Unknown"}
            </span>
            {getCountLabel() && (
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                {getCountLabel()}
              </span>
            )}
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
              {media.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 