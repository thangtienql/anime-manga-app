/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';

// Base URL for Jikan API v4
const API_BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting implementation
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
let lastRequestTime = 0;

// Helper function for rate limit events
const dispatchRateLimitEvent = (isRateLimited: boolean, retryIn: number = 0) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('jikan-rate-limit', { 
      detail: { isRateLimited, retryIn } 
    });
    window.dispatchEvent(event);
  }
};

// Helper function to respect rate limits
const respectRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timePassedSinceLastRequest = now - lastRequestTime;
  
  if (timePassedSinceLastRequest < RATE_LIMIT_DELAY) {
    const delayNeeded = RATE_LIMIT_DELAY - timePassedSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delayNeeded));
  }
  
  lastRequestTime = Date.now();
};

// Retry logic
const requestWithRetry = async <T>(requestFn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    await respectRateLimit();
    const result = await requestFn();
    // Clear rate limit notification if request succeeds
    dispatchRateLimitEvent(false);
    return result;
  } catch (error: any) {
    if (error?.response?.status === 429 && retries > 0) {
      console.log(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
      // Notify about rate limiting
      dispatchRateLimitEvent(true, Math.ceil(delay / 1000));
      await new Promise(resolve => setTimeout(resolve, delay));
      return requestWithRetry(requestFn, retries - 1, delay * 1.5);
    }
    // Clear rate limit notification for other errors
    dispatchRateLimitEvent(false);
    throw error;
  }
};

// Interfaces for API responses
export interface JikanResponse<T> {
  data: T[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    }
  }
}

// Anime interfaces
export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    },
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: any;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  genres: { mal_id: number; type: string; name: string; url: string }[];
  explicit_genres: { mal_id: number; type: string; name: string; url: string }[];
  themes: { mal_id: number; type: string; name: string; url: string }[];
  demographics: { mal_id: number; type: string; name: string; url: string }[];
}

// Manga interfaces
export interface Manga {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    },
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
  };
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: {
    from: string;
    to: string;
    prop: any;
  };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  authors: { mal_id: number; type: string; name: string; url: string }[];
  serializations: { mal_id: number; type: string; name: string; url: string }[];
  genres: { mal_id: number; type: string; name: string; url: string }[];
  explicit_genres: { mal_id: number; type: string; name: string; url: string }[];
  themes: { mal_id: number; type: string; name: string; url: string }[];
  demographics: { mal_id: number; type: string; name: string; url: string }[];
}

// Genres
export interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

// Filter types
export interface AnimeFilters {
  q?: string;
  page?: number;
  limit?: number;
  type?: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music' | '';
  status?: 'airing' | 'complete' | 'upcoming';
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
  genres?: number[];
  min_score?: number;
  order_by?: 'title' | 'start_date' | 'end_date' | 'score' | 'rank' | 'popularity';
  sort?: 'desc' | 'asc';
}

export interface MangaFilters {
  q?: string;
  page?: number;
  limit?: number;
  type?: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua' | '';
  status?: 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming';
  genres?: number[];
  min_score?: number;
  order_by?: 'title' | 'start_date' | 'end_date' | 'score' | 'rank' | 'popularity';
  sort?: 'desc' | 'asc';
}

// API functions
export const getAnime = async (filters: AnimeFilters): Promise<JikanResponse<Anime>> => {

  return requestWithRetry(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/anime`, { params: filters });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 429) {
        console.error('Error fetching anime:', error);
      }
      throw error;
    }
  });
};

export const getManga = async (filters: MangaFilters): Promise<JikanResponse<Manga>> => {
  return requestWithRetry(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manga`, { params: filters });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 429) {
        console.error('Error fetching manga:', error);
      }
      throw error;
    }
  });
};

export const getAnimeById = async (id: string | number): Promise<{ data: Anime }> => {
  if (!id) {
    throw new Error("Invalid anime ID provided");
  }
  
  return requestWithRetry(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/anime/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 429) {
        console.error(`Error fetching anime with ID ${id}:`, error);
      }
      throw error;
    }
  });
};

export const getMangaById = async (id: string | number): Promise<{ data: Manga }> => {
  if (!id) {
    throw new Error("Invalid manga ID provided");
  }
  
  return requestWithRetry(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manga/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 429) {
        console.error(`Error fetching manga with ID ${id}:`, error);
      }
      throw error;
    }
  });
};

export const getAnimeGenres = async (): Promise<{ data: Genre[] }> => {
  return requestWithRetry(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/genres/anime`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 429) {
        console.error('Error fetching anime genres:', error);
      }
      throw error;
    }
  });
};

export const getMangaGenres = async (): Promise<{ data: Genre[] }> => {
  return requestWithRetry(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/genres/manga`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 429) {
        console.error('Error fetching manga genres:', error);
      }
      throw error;
    }
  });
}; 