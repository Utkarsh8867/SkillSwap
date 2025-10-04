'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming you have this hook
import api from '@/services/api';
import { FaSearch, FaTimes, FaHistory, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '@/hooks/useLocalStorage';

export const SearchBar = ({ onSearch, placeholder = "Search for skills, posts, or users..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        // Replace with your actual suggestions endpoint
        // const { data } = await api.get(`/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        // setSuggestions(data.suggestions || []);

        // Using dummy suggestions for now
        const dummySuggestions = ['React', 'Python', 'UI/UX Design', 'Node.js'].filter(s =>
          s.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setSuggestions(dummySuggestions);

      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (searchTerm) => {
    const term = searchTerm.trim();
    if (term === '') return;

    // Add to search history
    const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5); // Keep last 5
    setSearchHistory(newHistory);

    setShowSuggestions(false);

    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(term);
    } else {
      // Fallback to navigation
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <form onSubmit={handleFormSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            ) : (
              <FaSearch className="h-5 w-5 text-gray-400" />
            )}
          </div>
          {query && !isLoading && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              {query.length > 0 && suggestions.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <FaChartLine className="inline mr-2" /> Suggestions
                  </div>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </>
              )}
              {searchHistory.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <FaHistory className="inline mr-2" /> Recent Searches
                  </div>
                  {searchHistory.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {item}
                    </button>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};