/* eslint-disable @typescript-eslint/no-explicit-any */
import { Anime, Manga } from './api';

export type WishlistItem = {
  id: number;
  type: 'anime' | 'manga';
  title: string;
  image: string;
  addedAt: number;
};

const STORAGE_KEY = 'anime-manga-wishlist';

// Event type for wishlist changes
type WishlistChangeCallback = (items: WishlistItem[]) => void;

// Helper to check if running in the browser
const isBrowser = typeof window !== 'undefined';

class WishlistStore {
  items: WishlistItem[] = [];
  private listeners: WishlistChangeCallback[] = [];
  private initialized = false;

  constructor() {
    // Always ensure items is an array
    this.items = [];
    
    if (isBrowser) {
      // Try to load immediately
      this.loadFromStorage();
      this.setupStorageListener();
      
      // Also defer initialization to ensure everything is loaded
      setTimeout(() => {
        this.loadFromStorage();
        this.initialized = true;
        this.notifyListeners();
      }, 0);
    }
  }

  private setupStorageListener() {
    if (!isBrowser) return;
    
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) {
        this.loadFromStorage();
        this.notifyListeners();
      }
    });
  }

  private loadFromStorage() {
    if (!isBrowser) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse wishlist data from localStorage', e);
      this.items = [];
    }
  }

  private saveToStorage() {
    if (!isBrowser) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save wishlist data to localStorage', e);
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.items]));
  }

  addToWishlist(item: Anime | Manga, type: 'anime' | 'manga') {
    // Ensure items is always an array
    if (!Array.isArray(this.items)) {
      this.items = [];
    }
    
    // Check if item already exists in wishlist
    if (this.items.some(wishlistItem => wishlistItem.id === item.mal_id && wishlistItem.type === type)) {
      return;
    }
    
    const newItem: WishlistItem = {
      id: item.mal_id,
      type,
      title: item.title,
      image: item.images.jpg.image_url,
      addedAt: Date.now(),
    };
    
    this.items = [...this.items, newItem];
    this.saveToStorage();
    this.notifyListeners();
  }
  
  removeFromWishlist(id: any, type: 'anime' | 'manga') {
    // Ensure items is always an array
    if (!Array.isArray(this.items)) {
      this.items = [];
      return;
    }
    
    this.items = this.items.filter(item => !(item.id === id && item.type === type));
    this.saveToStorage();
    this.notifyListeners();
  }
  
  isInWishlist(id: any, type: 'anime' | 'manga') {
    // Ensure items is always an array
    if (!Array.isArray(this.items)) {
      this.items = [];
      return false;
    }
    
    return this.items.some(item => item.id === id && item.type === type);
  }
  
  // Subscribe to changes
  subscribe(callback: WishlistChangeCallback): () => void {
    this.listeners.push(callback);
    
    // Immediately notify with current state
    callback([...this.items]);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  // Get all items
  getItems(): WishlistItem[] {
    // Ensure items is always an array
    if (!Array.isArray(this.items)) {
      this.items = [];
    }
    
    return [...this.items];
  }
}

// Create the singleton instance
export const wishlistStore = new WishlistStore(); 