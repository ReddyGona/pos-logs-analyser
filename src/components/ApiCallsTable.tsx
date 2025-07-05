import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Globe, Hash, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Globe className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No API Calls Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </CardContent>
      </Card>
    );
  }

  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case 'GET': return 'secondary';
      case 'POST': return 'default';
      case 'PUT': return 'outline';
      case 'DELETE': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (statusCode: number | undefined) => {
    if (!statusCode) return 'destructive';
    if (statusCode >= 200 && statusCode < 300) return 'secondary';
    if (statusCode >= 400) return 'destructive';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-1"></div>
          <div className="col-span-1">Method</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-5">URL</div>
          <div className="col-span-2">Latency</div>
          <div className="col-span-2">Timestamp</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {apiCalls.map((call, index) => {
            const isExpanded = expandedRows.has(index);
            const statusCode = call.error?.statusCode || call.response?.statusCode;
            const latency = call.response?.headers?.['x-envoy-upstream-service-time'] || '-';
            
            return (
              <div key={index} className="group">
                {/* Main Row */}
                <div 
                  className="grid grid-cols-12 gap-4 items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleRow(index)}
                >
                  {/* Expand Button */}
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Method */}
                  <div className="col-span-1">
                    <Badge variant={getMethodBadgeVariant(call.method)}>
                      {call.method}
                    </Badge>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <Badge variant={getStatusBadgeVariant(statusCode)}>
                      {statusCode}
                    </Badge>
                  </div>

                  {/* URL */}
                  <div className="col-span-5">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate text-sm font-medium" title={call.url}>
                        {call.url}
                      </span>
                    </div>
                  </div>

                  {/* Latency */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">
                        {latency === '-' ? latency : `${latency}ms`}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="col-span-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatTimestamp(call.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t bg-muted/25">
                    <div className="p-6">
                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* Response Details */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-base">
                              <Hash className="h-4 w-4" />
                              <span>Response Details</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="rounded-md bg-muted p-4">
                              <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                                {JSON.stringify(call.response, null, 2)}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Request Info & Error */}
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-base">
                                <Globe className="h-4 w-4" />
                                <span>Request Information</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Method</span>
                                <Badge variant={getMethodBadgeVariant(call.method)}>
                                  {call.method}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <Badge variant={getStatusBadgeVariant(statusCode)}>
                                  {statusCode}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Latency</span>
                                <span className="text-sm font-mono">
                                  {latency === '-' ? 'N/A' : `${latency}ms`}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Timestamp</span>
                                <span className="text-sm font-mono">
                                  {formatTimestamp(call.timestamp)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Error Details */}
                          {call.error && Object.keys(call.error).length > 0 && (
                            <Card className="border-destructive">
                              <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-base text-destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>Error Details</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <p className="text-sm text-destructive">
                                    {call.error.message || 'An error occurred during the API call'}
                                  </p>
                                  {call.error.statusCode && (
                                    <p className="text-xs text-muted-foreground">
                                      Status Code: {call.error.statusCode}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};