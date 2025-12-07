'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

export default function FilterBar({ onFilterChange, onSearchChange }) {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Notify parent - removed onSearchChange from dependencies to prevent infinite loop
  useEffect(() => {
    if (onSearchChange) onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onFilterChange) onFilterChange(newStatus);
  };

  const clearFilters = () => {
    setStatus('all');
    setSearch('');
    setDebouncedSearch('');
    if (onFilterChange) onFilterChange('all');
    if (onSearchChange) onSearchChange('');
  };

  const hasActiveFilters = status !== 'all' || search.length > 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search Input - IMPROVED VISIBILITY */}
        <div className="flex-1 w-full relative group">
          <FiSearch 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 text-gray-900 text-base font-medium border-2 border-gray-200 
              rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none 
              transition-all placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>

        {/* Status Dropdown - IMPROVED VISIBILITY */}
        <div className="relative w-full md:w-auto md:min-w-[200px]">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 text-gray-900 text-base font-medium border-2 border-gray-200 
              rounded-xl appearance-none cursor-pointer focus:bg-white focus:border-blue-500 focus:ring-4 
              focus:ring-blue-100 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full md:w-auto px-5 py-3.5 text-base font-semibold text-red-600 bg-red-50 
              hover:bg-red-100 hover:text-red-700 rounded-xl transition-all border-2 border-red-200 
              hover:border-red-300 flex items-center justify-center gap-2"
          >
            <FiX size={18} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {status !== 'all' && (
            <span className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
              Status: {status}
              <button 
                onClick={() => handleStatusChange({ target: { value: 'all' } })} 
                className="ml-2 hover:text-blue-900 p-0.5"
              >
                <FiX size={16} />
              </button>
            </span>
          )}

          {search && (
            <span className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-300">
              Search: "{search}"
              <button 
                onClick={() => setSearch('')} 
                className="ml-2 hover:text-purple-900 p-0.5"
              >
                <FiX size={16} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}