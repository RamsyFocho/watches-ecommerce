"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Generate suggestions based on query
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    
    // Exact name matches first
    const exactMatches = products.filter(p => 
      p.name.toLowerCase().includes(queryLower)
    );

    // Partial matches in name
    const partialNameMatches = products.filter(p => 
      p.name.toLowerCase().split(' ').some(word => word.startsWith(queryLower))
    );

    // Category matches
    const categoryMatches = products.filter(p => 
      p.category.toLowerCase().includes(queryLower)
    );

    // Brand matches
    const brandMatches = products.filter(p => 
      p.brand?.toLowerCase().includes(queryLower)
    );

    // Combine and deduplicate results
    const allResults = [...exactMatches, ...partialNameMatches, ...categoryMatches, ...brandMatches];
    const uniqueResults = Array.from(
      new Map(allResults.map(item => [item.id, item])).values()
    ).slice(0, 8); // Limit to 8 suggestions

    setSuggestions(uniqueResults);
    setIsOpen(true);
  }, []);

  // Debounced search handler
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      generateSuggestions(query);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, generateSuggestions]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (productName: string) => {
    saveToRecentSearches(productName);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    generateSuggestions(recentQuery);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative hidden md:block w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search for watches, brands, categories..."
            className="pl-9 pr-4 py-2 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.length > 0 || recentSearches.length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                saveToRecentSearches(query.trim());
                setIsOpen(false);
              }
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end" sideOffset={5}>
        {suggestions.length > 0 ? (
          <div className="flex flex-col py-2">
            {/* Suggestions Header */}
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-medium text-muted-foreground">Suggestions</p>
            </div>
            
            {/* Suggestions List */}
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
                {Array.from(new Set(products.map(p => p.category))).slice(0, 4).map(category => (
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
      </PopoverContent>
    </Popover>
  );
}