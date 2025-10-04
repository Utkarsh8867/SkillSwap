'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CATEGORIES, SKILL_LEVELS, LOCATIONS, POST_TYPES } from '@/utils/constants';

const FilterSection = ({ title, options, selected, onSelect, sectionKey }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b dark:border-gray-700 py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white"
      >
        {title}
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-3">
              {options.map((option) => (
                <label key={option.value || option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value || option)}
                    onChange={() => onSelect(sectionKey, option.value || option)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label || option}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SearchFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({ ...filters, [filterType]: newValues });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };
  
  const hasActiveFilters = Object.values(filters).some(arr => Array.isArray(arr) && arr.length > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaFilter className="mr-2" /> Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-sm text-primary-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <FilterSection
        title="Category"
        options={CATEGORIES}
        selected={filters.category || []}
        onSelect={handleFilterChange}
        sectionKey="category"
      />
      <FilterSection
        title="Skill Level"
        options={SKILL_LEVELS}
        selected={filters.skillLevel || []}
        onSelect={handleFilterChange}
        sectionKey="skillLevel"
      />
      <FilterSection
        title="Location"
        options={LOCATIONS}
        selected={filters.location || []}
        onSelect={handleFilterChange}
        sectionKey="location"
      />
      <FilterSection
        title="Post Type"
        options={POST_TYPES}
        selected={filters.postType || []}
        onSelect={handleFilterChange}
        sectionKey="postType"
      />
    </div>
  );
};