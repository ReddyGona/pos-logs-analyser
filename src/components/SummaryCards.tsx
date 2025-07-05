import { Activity, CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react';
import type { LogSummary } from '../types';

interface SummaryCardsProps {
  summary: LogSummary;
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const cards = [
    {
      title: 'Total API Calls',
      value: summary.totalCalls,
      icon: Activity,
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-700',
    },
    {
      title: 'Successful Calls',
      value: summary.successfulCalls,
      icon: CheckCircle,
      color: 'bg-green-50',
      iconColor: 'text-green-500',
      textColor: 'text-green-700',
    },
    {
      title: 'Failed Calls',
      value: summary.failedCalls,
      icon: XCircle,
      color: 'bg-red-50',
      iconColor: 'text-red-500',
      textColor: 'text-red-700',
    },
    {
      title: 'Error Rate',
      value: `${summary.errorRate}%`,
      icon: TrendingUp,
      color: summary.errorRate > 10 ? 'bg-red-50' : 'bg-yellow-50',
      iconColor: summary.errorRate > 10 ? 'text-red-500' : 'text-yellow-500',
      textColor: summary.errorRate > 10 ? 'text-red-700' : 'text-yellow-700',
    },
    {
      title: 'Average Latency',
      value: `${summary.averageLatency}ms`,
      icon: Clock,
      color: 'bg-purple-50',
      iconColor: 'text-purple-500',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`flex items-center p-5 rounded-xl shadow-md transition hover:scale-105 ${card.color} border border-gray-100 hover:shadow-lg`}
          >
            <div className={`rounded-full p-3 bg-white shadow mr-4 ${card.iconColor}`}>
              <Icon className={`w-7 h-7`} />
            </div>
            <div>
              <div className={`text-sm font-medium ${card.textColor}`}>{card.title}</div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
