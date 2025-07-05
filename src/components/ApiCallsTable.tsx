import { ChevronDown, ChevronRight, Clock, Globe, Hash } from 'lucide-react';
import { useState } from 'react';
import type { ApiCall } from '../types';
import { formatTimestamp, getMethodColor, getStatusColor } from '../utils/logAnalyzer';

interface ApiCallsTableProps {
  apiCalls: ApiCall[];
}

export const ApiCallsTable = ({ apiCalls }: ApiCallsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  if (apiCalls.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Calls Found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 items-center text-xs font-bold text-gray-600 uppercase tracking-wider">
          <div className="col-span-1"></div>
          <div className="col-span-1">Method</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-5">URL</div>
          <div className="col-span-2">Latency</div>
          <div className="col-span-2">Timestamp</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {apiCalls.map((call, index) => {
          const isExpanded = expandedRows.has(index);
          const statusCode = call.error?.statusCode || call.response?.statusCode;
          const latency = call.response?.headers?.['x-envoy-upstream-service-time'] || '-';
          
          return (
            <div key={index} className="group">
              {/* Main Row */}
              <div 
                className={`grid grid-cols-12 gap-4 items-center px-6 py-4 cursor-pointer transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-blue-50 group-hover:shadow-sm`}
                onClick={() => toggleRow(index)}
              >
                {/* Expand Button */}
                <div className="col-span-1 flex items-center">
                  <button className="p-1 rounded-lg hover:bg-white/50 transition-colors duration-200">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    )}
                  </button>
                </div>

                {/* Method */}
                <div className="col-span-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getMethodColor(call.method)}`}>
                    {call.method}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(statusCode)}`}>
                    {statusCode}
                  </span>
                </div>

                {/* URL */}
                <div className="col-span-5">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate text-sm text-gray-900 font-medium" title={call.url}>
                      {call.url}
                    </span>
                  </div>
                </div>

                {/* Latency */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">
                      {latency === '-' ? latency : `${latency}ms`}
                    </span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="col-span-2">
                  <span className="text-sm text-gray-600 font-mono">
                    {formatTimestamp(call.timestamp)}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-100">
                  <div className="px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Response Details */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Hash className="w-4 h-4 text-blue-500" />
                          <h4 className="font-semibold text-gray-900">Response Details</h4>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                          <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                            {JSON.stringify(call.response, null, 2)}
                          </pre>
                        </div>

                        {call.error && Object.keys(call.error).length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="font-semibold text-red-800">Error Details</span>
                            </div>
                            <p className="text-sm text-red-700">
                              {call.error.message || 'An error occurred during the API call'}
                            </p>
                            {call.error.statusCode && (
                              <p className="text-xs text-red-600 mt-1">
                                Status Code: {call.error.statusCode}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Request Info */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Globe className="w-4 h-4 text-green-500" />
                          <h4 className="font-semibold text-gray-900">Request Information</h4>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Method</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getMethodColor(call.method)}`}>
                              {call.method}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Status</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(statusCode)}`}>
                              {statusCode}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Latency</span>
                            <span className="text-sm text-gray-900 font-mono">
                              {latency === '-' ? 'N/A' : `${latency}ms`}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-gray-600">Timestamp</span>
                            <span className="text-sm text-gray-900 font-mono">
                              {formatTimestamp(call.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};