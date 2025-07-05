import { BarChart3, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ApiCallsTable } from './components/ApiCallsTable';
import { FileUpload } from './components/FileUpload';
import { FilterControls } from './components/FilterControls';
import { SummaryCards } from './components/SummaryCards';
import type { ApiCall } from './types';
import {
  calculateSummary,
  isEzetapUrl,
  processLogData,
} from './utils/logAnalyzer';

function App() {
  const [logData, setLogData] = useState<ApiCall[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEzetapOnly, setShowEzetapOnly] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (data: any[]) => {
    try {
      const processedData = processLogData(data);
      setLogData(processedData);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const filteredData = useMemo(() => {
    return logData.filter((call) => {
      // Search term filter
      if (
        searchTerm &&
        !call.url.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !call.method.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Status code filter
      if (
        statusFilter &&
        (call.error?.statusCode?.toString() !== statusFilter &&
          call.response?.statusCode?.toString() !== statusFilter)
      ) {
        return false;
      }

      // Date range filter
      if (startDate) {
        const callDate = new Date(call.timestamp);
        if (callDate < new Date(startDate)) return false;
      }
      if (endDate) {
        const callDate = new Date(call.timestamp);
        if (callDate > new Date(endDate)) return false;
      }
      if (showEzetapOnly && !isEzetapUrl(call.url)) return false;
      if (showErrorsOnly && !call.error) return false;
      return true;
    });
  }, [logData, searchTerm, statusFilter, startDate, endDate, showEzetapOnly, showErrorsOnly]);

  const summary = useMemo(() => calculateSummary(filteredData), [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  POS Log Analyzer
                </h1>
                <p className="text-sm text-gray-500 font-medium">Professional API Log Analysis Dashboard</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Upload className="w-4 h-4" />
              <span>Upload logs to get started</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* File Upload Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <FileUpload onFileUpload={handleFileUpload} onError={setError} />
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Error:</span>
                  </div>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              )}
            </div>
          </section>

          {/* Dashboard Content */}
          {logData.length > 0 && (
            <>
              {/* Summary Cards */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Overview</h2>
                  <p className="text-gray-600">Key metrics from your API logs</p>
                </div>
                <SummaryCards summary={summary} />
              </section>

              {/* Filter Controls */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Filter & Search</h2>
                  <p className="text-gray-600">Refine your data analysis</p>
                </div>
                <FilterControls
                  apiCalls={logData}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  showEzetapOnly={showEzetapOnly}
                  setShowEzetapOnly={setShowEzetapOnly}
                  showErrorsOnly={showErrorsOnly}
                  setShowErrorsOnly={setShowErrorsOnly}
                />
              </section>

              {/* API Calls Table */}
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">API Calls Details</h2>
                    <p className="text-gray-600">
                      Showing {filteredData.length} of {logData.length} total calls
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {filteredData.length} results
                  </div>
                </div>
                <ApiCallsTable apiCalls={filteredData} />
              </section>
            </>
          )}

          {/* Empty State */}
          {logData.length === 0 && (
            <section className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
                <p className="text-gray-600 mb-6">
                  Upload your POS log files to start analyzing API performance and errors.
                </p>
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                  <p className="font-medium mb-2">Supported formats:</p>
                  <div className="flex justify-center space-x-4">
                    <span className="bg-white px-2 py-1 rounded border">.json</span>
                    <span className="bg-white px-2 py-1 rounded border">.txt</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;