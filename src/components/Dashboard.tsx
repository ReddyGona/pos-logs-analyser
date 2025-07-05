import { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { SummaryCards } from './SummaryCards';
import { FilterControls } from './FilterControls';
import { ApiCallsTable } from './ApiCallsTable';
import { calculateSummary, isEzetapUrl } from '../utils/logAnalyzer';
import type { ApiCall } from '../types';

interface DashboardProps {
  logData: ApiCall[];
  onBackToUpload: () => void;
}

export const Dashboard = ({ logData, onBackToUpload }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEzetapOnly, setShowEzetapOnly] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBackToUpload}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">POS Log Analyzer</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onBackToUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New File
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Summary Cards */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
            <p className="text-muted-foreground">Key metrics from your API logs</p>
          </div>
          <SummaryCards summary={summary} />
        </section>

        {/* Filter Controls */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Filter & Search</h2>
            <p className="text-muted-foreground">Refine your data analysis</p>
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">API Calls Details</h2>
              <p className="text-muted-foreground">
                Showing {filteredData.length} of {logData.length} total calls
              </p>
            </div>
            <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
              {filteredData.length} results
            </div>
          </div>
          <ApiCallsTable apiCalls={filteredData} />
        </section>
      </main>
    </div>
  );
};