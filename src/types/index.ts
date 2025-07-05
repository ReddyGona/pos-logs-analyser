export interface ApiCall {
  event_type: string;
  method: string;
  url: string;
  timestamp: string;
  response: {
    statusCode: number;
    headers: {
      'x-envoy-upstream-service-time': string;
    };
  };
  error: {
    statusCode?: number;
    message?: string;
  };
}

export interface LogSummary {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  errorRate: number;
  averageLatency: number;
}
