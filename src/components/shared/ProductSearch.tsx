"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  }, [recentSearches]);

  // Generate suggestions based on query
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    
    // Score-based search
    const scoredProducts = products.map(product => {
      let score = 0;
      
      // Exact name match (highest priority)
      if (product.name.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Word starts with query
      const nameWords = product.name.toLowerCase().split(' ');
      nameWords.forEach(word => {
        if (word.startsWith(queryLower)) {
          score += 5;
        }
      });
      
      // Category match
      if (product.category.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      // Brand match
      if (product.brand?.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      // Model type match
      if (product.modelType?.toLowerCase().includes(queryLower)) {
        score += 1;
      }
      
      return { product, score };
    });

    // Filter and sort by score
    const filtered = scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.product);

    setSuggestions(filtered);
    setIsOpen(filtered.length > 0 || searchQuery.length > 1);
  }, []);

  // Debounced search handler
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.length === 0) {
      setSuggestions([]);
      setIsOpen(isInputFocused && recentSearches.length > 0);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      generateSuggestions(query);
    }, 150); // Reduced debounce for smoother typing

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, generateSuggestions, isInputFocused, recentSearches.length]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both input and popover
      const isOutsideInput = inputRef.current && !inputRef.current.contains(target);
      const isOutsidePopover = popoverRef.current && !popoverRef.current.contains(target);
      
      if (isOutsideInput && isOutsidePopover) {
        setIsOpen(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = (productName: string) => {
    saveToRecentSearches(productName);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setIsInputFocused(false);
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsOpen(query.length > 0 || recentSearches.length > 0);
  };

  const handleInputBlur = () => {
    // Don't immediately close popover on blur - let click outside handle it
    setTimeout(() => {
      if (!document.activeElement?.closest('[data-popover]')) {
        setIsInputFocused(false);
      }
    }, 100);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveToRecentSearches(query.trim());
      // Here you could navigate to search results page
      console.log('Search submitted:', query);
      setIsOpen(false);
    }
  };

  // Memoized quick categories
  const quickCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    return categories.slice(0, 4);
  }, []);

  return (
    <div className="relative hidden md:block w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for watches, brands, categories..."
          className="pl-9 pr-10 py-2 w-full"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) {
              setIsOpen(true);
            }
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearchSubmit();
            }
            if (e.key === 'Escape') {
              clearSearch();
            }
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Custom Popover Implementation */}
      {isOpen && (
        <div 
          ref={popoverRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden"
          style={{ width: '400px', maxWidth: 'calc(100vw - 2rem)' }}
        >
          {suggestions.length > 0 ? (
            <div className="flex flex-col py-2">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium text-muted-foreground">Suggestions</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {suggestions.map(product => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                    onClick={() => handleLinkClick(product.name)}
                  >
                    <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.category}</span>
                        {product.brand && (
                          <>
                            <span className="text-xs">•</span>
                            <span>{product.brand}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-primary ml-2">
                      ${product.price}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : query.length > 1 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found for "{query}"
            </div>
          ) : (
            // Recent Searches or Empty State
            <div className="flex flex-col py-2">
              {recentSearches.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Recent Searches</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs h-7"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="py-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 p-3 hover:bg-accent text-left transition-colors"
                        onClick={() => handleRecentSearchClick(search)}
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <Search className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Search for products</p>
                  <p className="text-xs text-muted-foreground/70">
                    Type watch names, brands, or categories
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Quick Categories */}
          {!query && recentSearches.length > 0 && (
            <div className="border-t pt-2">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick Categories</p>
                <div className="flex flex-wrap gap-2">
                  {quickCategories.map(category => (
                    <button
                      key={category}
                      className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                      onClick={() => {
                        setQuery(category);
                        generateSuggestions(category);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}