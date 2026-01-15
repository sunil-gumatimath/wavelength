import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import type { PostWithRelations } from '@/types/blog';

interface UsePostFilterOptions {
  posts: PostWithRelations[];
  postsPerPage?: number;
}

interface UsePostFilterReturn {
  // Filtered results
  filteredPosts: PostWithRelations[];
  paginatedPosts: PostWithRelations[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Filters
  searchQuery: string;
  deferredSearchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  
  // Categories
  categories: string[];
  
  // Utilities
  clearFilters: () => void;
  hasActiveFilters: boolean;
  totalPosts: number;
}

export function usePostFilter({
  posts,
  postsPerPage = 6,
}: UsePostFilterOptions): UsePostFilterReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
  const [searchQuery, setSearchQueryState] = useState('');
  
  // Use deferred value for search to avoid blocking UI during typing
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach((post) => {
      post.postCategories.forEach(({ category }) => {
        if (category?.name) {
          categorySet.add(category.name);
        }
      });
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase().trim();
    
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory) {
        const hasCategory = post.postCategories.some(
          ({ category }) => category?.name === selectedCategory
        );
        if (!hasCategory) return false;
      }

      // Search filter - only if query exists
      if (query) {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt?.toLowerCase().includes(query) ?? false;
        const contentMatch = post.content.toLowerCase().includes(query);
        const authorMatch = post.author.name.toLowerCase().includes(query);
        const categoryMatch = post.postCategories.some(
          ({ category }) => category?.name.toLowerCase().includes(query)
        );
        
        if (!titleMatch && !excerptMatch && !contentMatch && !authorMatch && !categoryMatch) {
          return false;
        }
      }

      return true;
    });
  }, [posts, selectedCategory, deferredSearchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  
  // Ensure current page is valid
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedPosts = useMemo(() => {
    const start = (validCurrentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, validCurrentPage, postsPerPage]);

  // Handler functions that reset pagination
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    setCurrentPage(1);
  }, []);

  const setSelectedCategory = useCallback((category: string | null) => {
    setSelectedCategoryState(category);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQueryState('');
    setSelectedCategoryState(null);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const hasActiveFilters = Boolean(selectedCategory || searchQuery);

  return {
    filteredPosts,
    paginatedPosts,
    currentPage: validCurrentPage,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    searchQuery,
    deferredSearchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    clearFilters,
    hasActiveFilters,
    totalPosts: posts.length,
  };
}

