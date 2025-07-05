import { useMemo } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <div>
              <CardTitle>Advanced Filters</CardTitle>
              <CardDescription>Refine your search criteria</CardDescription>
            </div>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by URL, method, or endpoint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status Codes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status Codes</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status} {status.startsWith('2') ? '(Success)' : status.startsWith('4') ? '(Client Error)' : status.startsWith('5') ? '(Server Error)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="ezetap-only"
              checked={showEzetapOnly}
              onCheckedChange={setShowEzetapOnly}
            />
            <label htmlFor="ezetap-only" className="text-sm font-medium">
              Ezetap APIs Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="errors-only"
              checked={showErrorsOnly}
              onCheckedChange={setShowErrorsOnly}
            />
            <label htmlFor="errors-only" className="text-sm font-medium">
              Errors Only
            </label>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setStatusFilter('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {showEzetapOnly && (
                <Badge variant="secondary" className="gap-1">
                  Ezetap Only
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowEzetapOnly(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {showErrorsOnly && (
                <Badge variant="secondary" className="gap-1">
                  Errors Only
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowErrorsOnly(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};