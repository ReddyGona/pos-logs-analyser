import { format } from 'date-fns';
import type { ApiCall, LogSummary } from '../types';

export const processLogData = (data: any[]): ApiCall[] => {
  return data
    .filter((entry) => entry.event_type === 'API')
    .map((entry) => ({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    }));
};

export const calculateSummary = (apiCalls: ApiCall[]): LogSummary => {
  const totalCalls = apiCalls.length;
  const failedCalls = apiCalls.filter((call) => {
    const hasError = Object.keys(call.error || {}).length > 0;
    const noResponse = !call.response;
    const badStatus = call.response?.statusCode && ![200, 201].includes(call.response.statusCode);
    return hasError || noResponse || badStatus;
  }).length;

  const successfulCalls = totalCalls - failedCalls;
  const errorRate = totalCalls ? Math.round((failedCalls / totalCalls) * 100) : 0;

  const totalLatency = apiCalls.reduce((sum, call) => {
    const latency = parseInt(call.response?.headers?.['x-envoy-upstream-service-time'] || '0');
    return sum + latency;
  }, 0);

  const averageLatency = totalCalls ? Math.round(totalLatency / totalCalls) : 0;

  return {
    totalCalls,
    successfulCalls,
    failedCalls,
    errorRate,
    averageLatency,
  };
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  // Convert to IST (UTC+5:30)
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);
  return format(date, 'dd/MM/yyyy hh:mm:ss aa') + ' IST';
};

export const getStatusColor = (statusCode: number | undefined): string => {
  if (!statusCode) return 'bg-red-100 text-red-800';
  if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
  return 'bg-red-100 text-red-800';
};

export const getMethodColor = (method: string): string => {
  const colors: { [key: string]: string } = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  };
  return colors[method] || 'bg-gray-100 text-gray-800';
};

export const isEzetapUrl = (url: string): boolean => {
  return url.startsWith('https://ezetap.com') || url.startsWith('https://demo.ezetap.com');
};
