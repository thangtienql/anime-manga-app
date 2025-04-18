"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAnime, AnimeFilters, Anime } from "@/lib/api";
import SearchBar from "@/components/ui/SearchBar";
import FilterPanel from "@/components/ui/FilterPanel";
import AnimeCard from "@/components/anime/AnimeCard";
export default function AnimePage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnimeFilters>({
    page: 1,
    limit: 24,
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const observerTarget = useRef(null);
  const isLoadingMore = useRef(false);

  // Use a flag to track if we're mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAnime = useCallback(async (newFilters?: AnimeFilters, loadMore = false) => {
    if (!mounted) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentFilters = { ...filters, ...newFilters };
      const response = await getAnime(currentFilters);

      // If loading more, append to existing list, otherwise replace
      if (loadMore) {
        setAnimeList(prev => [...prev, ...response.data]);
      } else {
        setAnimeList(response.data);
      }

      setHasNextPage(response.pagination.has_next_page);
      setTotalItems(response.pagination.items.total);

      // Update filters with the new ones
      setFilters(currentFilters);
    } catch (err) {
      console.error("Error fetching anime:", err);
      if (err instanceof Error) {
        setError(`Failed to fetch anime: ${err.message}`);
      } else {
        setError("Failed to fetch anime. Please try again later.");
      }
    } finally {
      setIsLoading(false);
      isLoadingMore.current = false;
    }
  }, [filters, mounted]);

  // Initial fetch only after component is mounted - alternative approach with // eslint-disable-next-line
  useEffect(() => {
    if (mounted) {
      fetchAnime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isLoading && !isLoadingMore.current) {
          isLoadingMore.current = true;
          fetchAnime({ page: filters.page! + 1 }, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [mounted, hasNextPage, isLoading, filters.page, fetchAnime]);

  const handleSearch = (query: string) => {
    fetchAnime({ q: query, page: 1 });
  };

  const handleFilterApply = (newFilters: AnimeFilters) => {
    fetchAnime({ ...newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    // Tạo một bản sao filters mới với type là 'reset'
    const resetFilters: AnimeFilters = { ...filters, q: '', type:'', status:'', rating:'', order_by:''};
    fetchAnime(resetFilters);
    setResetKey(prev => prev + 1);
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Anime</h1>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for anime..."
          initialValue={filters.q || ""}
          resetKey={resetKey}
        />
      </div>

      <FilterPanel
        onResetFilters={() => handleResetFilters()}
        type="anime"
        onApplyFilters={(newFilters) => handleFilterApply(newFilters as AnimeFilters)}
        initialFilters={filters}
      />

      {/* Results stats */}
      {!isLoading && !error && animeList.length > 0 && (
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Found {totalItems.toLocaleString()} anime
          {filters.q ? ` for "${filters.q}"` : ""}
        </div>
      )}

      {/* Initial loading state */}
      {isLoading && animeList.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => fetchAnime()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results grid */}
      {!error && animeList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && animeList.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No anime found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => fetchAnime({ q: "", page: 1 })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {(isLoading && animeList.length > 0) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Observer target element */}
      {hasNextPage && <div ref={observerTarget} className="h-10 mt-4"></div>}
    </div>
  );
} 