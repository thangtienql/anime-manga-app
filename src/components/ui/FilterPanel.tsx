/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { AnimeFilters, MangaFilters, } from "@/lib/api";

interface FilterPanelProps {
  type: "anime" | "manga";
  onApplyFilters: (filters: AnimeFilters | MangaFilters) => void;
  onResetFilters?: () => void;
  initialFilters?: AnimeFilters | MangaFilters;
}

export default function FilterPanel({
  type,
  onApplyFilters,
  onResetFilters,
  initialFilters = {},
}: FilterPanelProps) {
  const [filters, setFilters] = useState<AnimeFilters | MangaFilters>(initialFilters);
  const [isExpanded] = useState(true);

  const handleFilterChange = useCallback(
    <K extends keyof (AnimeFilters & MangaFilters)>(
      key: K,
      value: (AnimeFilters & MangaFilters)[K]
    ) => {
      const updatedFilters = {
        ...filters,
        [key]: value,
      };
      setFilters(updatedFilters);
      onApplyFilters(updatedFilters);
    },
    [filters, onApplyFilters]
  );

  const handleResetFilters = () => {
    // Chỉ giữ lại các tham số cơ bản và bỏ các bộ lọc
    const defaultFilters: AnimeFilters | MangaFilters = {
      page: 1, // Reset về trang 1
      limit: initialFilters.limit || 24, // Giữ limit hoặc mặc định là 24
      q: '' // Giữ query tìm kiếm nếu có
    };
    
    // Reset state nội bộ trước
    setFilters(defaultFilters);
    
    // Thông báo cho component cha biết về việc reset và tải lại dữ liệu
    // onApplyFilters(defaultFilters);
    onResetFilters?.();
  };

  // Define filter options based on the type (anime or manga)
  const typeOptions = type === "anime"
    ? [
        { value: "tv", label: "TV" },
        { value: "movie", label: "Movie" },
        { value: "ova", label: "OVA" },
        { value: "special", label: "Special" },
        { value: "ona", label: "ONA" },
        { value: "music", label: "Music" },
      ]
    : [
        { value: "manga", label: "Manga" },
        { value: "novel", label: "Novel" },
        { value: "lightnovel", label: "Light Novel" },
        { value: "oneshot", label: "One-shot" },
        { value: "doujin", label: "Doujin" },
        { value: "manhwa", label: "Manhwa" },
        { value: "manhua", label: "Manhua" },
      ];

  const statusOptions = type === "anime"
    ? [
        { value: "airing", label: "Airing" },
        { value: "complete", label: "Completed" },
        { value: "upcoming", label: "Upcoming" },
      ]
    : [
        { value: "publishing", label: "Publishing" },
        { value: "complete", label: "Completed" },
        { value: "hiatus", label: "On Hiatus" },
        { value: "discontinued", label: "Discontinued" },
        { value: "upcoming", label: "Upcoming" },
      ];

  const ratingOptions = [
    { value: "g", label: "G - All Ages" },
    { value: "pg", label: "PG - Children" },
    { value: "pg13", label: "PG-13 - Teens 13+" },
    { value: "r17", label: "R - 17+" },
    { value: "r", label: "R+ - Mild Nudity" },
    { value: "rx", label: "Rx - Hentai" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type filter */}
            <div>
              <label className="block mb-2 font-medium">Type</label>
              <select
                value={(filters.type as string) || ""}
                onChange={(e) => {
                  const value = e.target.value || undefined;
                  handleFilterChange("type", value as any);
                }}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="">All Types</option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block mb-2 font-medium">Status</label>
              <select
                value={(filters.status as string) || ""}
                onChange={(e) => {
                  const value = e.target.value || undefined;
                  handleFilterChange("status", value as any);
                }}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="">All Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating filter (anime only) */}
            {type === "anime" && (
              <div>
                <label className="block mb-2 font-medium">Rating</label>
                <select
                  value={(filters as AnimeFilters).rating || ""}
                  onChange={(e) => {
                    const value = e.target.value || undefined;
                    handleFilterChange("rating", value as any);
                  }}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="">All Ratings</option>
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort filter */}
            <div>
              <label className="block mb-2 font-medium">Sort By</label>
              <select
                value={(filters.order_by as string) || ""}
                onChange={(e) => {
                  const value = e.target.value || undefined;
                  handleFilterChange("order_by", value as any);
                }}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="">Default</option>
                <option value="title">Title</option>
                <option value="score">Score</option>
                <option value="popularity">Popularity</option>
                <option value="rank">Rank</option>
              </select>
            </div>
          </div>

          {/* Filter actions */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 ease-in-out rounded inline-flex items-center gap-2"
              aria-label="Reset all filters"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" 
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 