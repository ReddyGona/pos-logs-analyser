import { ChevronDown, ChevronRight } from 'lucide-react';
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

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-10"></th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Latency
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {apiCalls.map((call, index) => {
            const isExpanded = expandedRows.has(index);
            const statusCode = call.error?.statusCode || call.response?.statusCode;
            const latency = call.response?.headers?.['x-envoy-upstream-service-time'] || '-';
            
            return (
              <>
                <tr 
                  key={`${index}-main`}
                  className={`hover:bg-blue-50 transition cursor-pointer group ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  onClick={() => toggleRow(index)}
                >
                  <td className="px-4 py-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getMethodColor(call.method)}`}>{call.method}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(statusCode)}`}>{statusCode}</span>
                  </td>
                  <td className="px-6 py-3 truncate max-w-xs" title={call.url}>{call.url}</td>
                  <td className="px-6 py-3">{latency}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatTimestamp(call.timestamp)}</td>
                </tr>
                {isExpanded && (
                  <tr key={`${index}-expanded`} className="bg-blue-50">
                    <td colSpan={6} className="px-8 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold text-gray-700 mb-1">Response</div>
                          <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto mb-2"><code>{JSON.stringify(call.response, null, 2)}</code></pre>
                          {call.error && (
                            <div className="mt-2 text-red-600 font-semibold">Error: {call.error.message}</div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
