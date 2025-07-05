import { Activity, CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { LogSummary } from '../types';

interface SummaryCardsProps {
  summary: LogSummary;
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const cards = [
    {
      title: 'Total API Calls',
      value: summary.totalCalls.toLocaleString(),
      icon: Activity,
      description: 'Total number of API requests',
    },
    {
      title: 'Successful Calls',
      value: summary.successfulCalls.toLocaleString(),
      icon: CheckCircle,
      description: `${summary.totalCalls > 0 ? Math.round((summary.successfulCalls / summary.totalCalls) * 100) : 0}% success rate`,
      variant: 'success' as const,
    },
    {
      title: 'Failed Calls',
      value: summary.failedCalls.toLocaleString(),
      icon: XCircle,
      description: `${summary.totalCalls > 0 ? Math.round((summary.failedCalls / summary.totalCalls) * 100) : 0}% failure rate`,
      variant: 'destructive' as const,
    },
    {
      title: 'Error Rate',
      value: `${summary.errorRate}%`,
      icon: TrendingUp,
      description: summary.errorRate > 10 ? 'High error rate' : summary.errorRate > 5 ? 'Medium error rate' : 'Low error rate',
      variant: summary.errorRate > 10 ? 'destructive' as const : summary.errorRate > 5 ? 'secondary' as const : 'success' as const,
    },
    {
      title: 'Average Latency',
      value: `${summary.averageLatency}ms`,
      icon: Clock,
      description: summary.averageLatency > 1000 ? 'Slow response' : summary.averageLatency > 500 ? 'Medium response' : 'Fast response',
      variant: summary.averageLatency > 1000 ? 'destructive' as const : summary.averageLatency > 500 ? 'secondary' as const : 'success' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                {card.variant && (
                  <Badge 
                    variant={card.variant === 'success' ? 'secondary' : card.variant}
                    className={
                      card.variant === 'success' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : ''
                    }
                  >
                    {card.variant === 'success' ? 'Good' : card.variant === 'destructive' ? 'Alert' : 'Warning'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};