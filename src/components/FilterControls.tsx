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

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by URL or method..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full"
        >
          <option value="">All Status Codes</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <div className="flex gap-2 items-center">
          <label className="inline-flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showEzetapOnly}
              onChange={(e) => setShowEzetapOnly(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2">Ezetap Only</span>
          </label>
          <label className="inline-flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showErrorsOnly}
              onChange={(e) => setShowErrorsOnly(e.target.checked)}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <span className="ml-2">Errors Only</span>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
