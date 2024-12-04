'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ activeCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue) {
        router.push(`/stores?category=${activeCategory}&search=${searchValue}`);
      } else {
        router.push(`/stores?category=${activeCategory}`);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue, activeCategory, router]);

  return (
    <div className="relative w-full md:w-1/2 lg:w-1/3">
      <input
        type="text"
        placeholder="Search stores..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="
          w-full px-4 py-3 pl-12 rounded-xl 
           border focus:ring-2 focus:ring-emerald-500 
          transition-all duration-300 text-gray-700
        "
      />
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500"
        size={24}
      />
    </div>
  );
}