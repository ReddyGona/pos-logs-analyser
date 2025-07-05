import { Filter, Search, X } from 'lucide-react';
import { useMemo } from 'react';
import type { ApiCall } from '../types';

interface FilterControlsProps {
  apiCalls: ApiCall[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  showEzetapOnly: boolean;
  setShowEzetapOnly: (value: boolean) => void;
  showErrorsOnly: boolean;
  setShowErrorsOnly: (value: boolean) => void;
}

export const FilterControls = ({
  apiCalls,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showEzetapOnly,
  setShowEzetapOnly,
  showErrorsOnly,
  setShowErrorsOnly,
}: FilterControlsProps) => {
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    apiCalls.forEach((call) => {
      const status = call.error?.statusCode || call.response?.statusCode;
      if (status) statuses.add(status.toString());
    });
    return Array.from(statuses).sort((a, b) => parseInt(a) - parseInt(b));
  }, [apiCalls]);

  const hasActiveFilters = searchTerm || statusFilter || startDate || endDate || showEzetapOnly || showErrorsOnly;

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setShowEzetapOnly(false);
    setShowErrorsOnly(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            <p className="text-sm text-gray-500">Refine your search criteria</p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Search and Status Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by URL, method, or endpoint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">All Status Codes</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status} {status.startsWith('2') ? '(Success)' : status.startsWith('4') ? '(Client Error)' : status.startsWith('5') ? '(Server Error)' : ''}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Toggle Filters */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={showEzetapOnly}
              onChange={(e) => setShowEzetapOnly(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
              showEzetapOnly ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                showEzetapOnly ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`}></div>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
            Ezetap APIs Only
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={showErrorsOnly}
              onChange={(e) => setShowErrorsOnly(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
              showErrorsOnly ? 'bg-red-500' : 'bg-gray-200'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                showErrorsOnly ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`}></div>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-200">
            Errors Only
          </span>
        </label>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('')} className="ml-2 hover:text-green-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {showEzetapOnly && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Ezetap Only
                <button onClick={() => setShowEzetapOnly(false)} className="ml-2 hover:text-purple-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {showErrorsOnly && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Errors Only
                <button onClick={() => setShowErrorsOnly(false)} className="ml-2 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};