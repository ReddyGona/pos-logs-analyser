import { Upload } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 pb-16">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3">
          <Upload className="text-blue-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">POS Log Analyzer Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 mt-10 flex flex-col gap-8">
        <section className="mb-4">
          <FileUpload onFileUpload={handleFileUpload} onError={setError} />
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </section>
        {logData.length > 0 && (
          <>
            <section>
              <SummaryCards summary={summary} />
            </section>
            <section>
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
            <section>
              <ApiCallsTable apiCalls={filteredData} />
            </section>
          </>
        )}
        {logData.length === 0 && (
          <div className="text-center text-gray-400 mt-24 text-lg">
            Upload a log file to get started.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
