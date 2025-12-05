"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredProducts);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setIsOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        {results.length > 0 ? (
          <div className="flex flex-col gap-2 p-2">
            {results.slice(0, 5).map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent"
                onClick={handleLinkClick}
              >
                <div className="relative h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={product.image.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {query.length > 1 ? "No products found." : "Start typing to search."}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
