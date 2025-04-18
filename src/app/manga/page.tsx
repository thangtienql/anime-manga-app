"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getManga, MangaFilters, Manga } from "../../lib/api";
import SearchBar from "@/components/ui/SearchBar";
import FilterPanel from "@/components/ui/FilterPanel";
import MangaCard from "@/components/manga/MangaCard";

export default function MangaPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MangaFilters>({
    page: 1,
    limit: 24,
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  const observerTarget = useRef(null);
  const isLoadingMore = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchManga = useCallback(async (newFilters?: MangaFilters, loadMore = false) => {
    if (!mounted) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentFilters = { ...filters, ...newFilters };
      const response = await getManga(currentFilters);
      
      // If loading more, append to existing list, otherwise replace
      if (loadMore) {
        setMangaList(prev => [...prev, ...response.data]);
      } else {
        setMangaList(response.data);
      }
      
      setHasNextPage(response.pagination.has_next_page);
      setTotalItems(response.pagination.items.total);
      
      setFilters(currentFilters);
    } catch (err) {
      console.error("Error fetching manga:", err);
      if (err instanceof Error) {
        setError(`Failed to fetch manga: ${err.message}`);
      } else {
        setError("Failed to fetch manga. Please try again later.");
      }
    } finally {
      setIsLoading(false);
      isLoadingMore.current = false;
    }
  }, [filters, mounted]);

  useEffect(() => {
    if (mounted) {
      fetchManga();
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
          fetchManga({ page: filters.page! + 1 }, true);
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
  }, [mounted, hasNextPage, isLoading, filters.page, fetchManga]);

  const handleSearch = (query: string) => {
    fetchManga({ q: query, page: 1 });
  };

  const handleFilterApply = (newFilters: MangaFilters) => {
    fetchManga({ ...newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    const resetFilters: MangaFilters = { ...filters, type:''};
    setFilters(resetFilters);
    fetchManga(resetFilters);
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
        <h1 className="text-3xl font-bold mb-6">Explore Manga</h1>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for manga..." 
          initialValue={filters.q || ""}
        />
      </div>

      <FilterPanel 
        type="manga" 
        onResetFilters={handleResetFilters}
        onApplyFilters={(newFilters) => handleFilterApply(newFilters as MangaFilters)}
        initialFilters={filters}
      />

      {!isLoading && !error && mangaList.length > 0 && (
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Found {totalItems.toLocaleString()} manga
          {filters.q ? ` for "${filters.q}"` : ""}
        </div>
      )}

      {/* Initial loading state */}
      {isLoading && mangaList.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => fetchManga()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!error && mangaList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mangaList.map((manga) => (
            <MangaCard key={manga.mal_id} manga={manga} />
          ))}
        </div>
      )}

      {!isLoading && !error && mangaList.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No manga found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => fetchManga({ q: "", page: 1 })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {(isLoading && mangaList.length > 0) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Observer target element */}
      {hasNextPage && <div ref={observerTarget} className="h-10 mt-4"></div>}
    </div>
  );
} 