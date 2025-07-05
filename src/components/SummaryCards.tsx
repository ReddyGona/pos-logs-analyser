import { Activity, CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react';
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
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700',
      change: null,
    },
    {
      title: 'Successful Calls',
      value: summary.successfulCalls.toLocaleString(),
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      textColor: 'text-green-700',
      change: summary.totalCalls > 0 ? `${Math.round((summary.successfulCalls / summary.totalCalls) * 100)}%` : null,
    },
    {
      title: 'Failed Calls',
      value: summary.failedCalls.toLocaleString(),
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      iconBg: 'bg-red-500',
      textColor: 'text-red-700',
      change: summary.totalCalls > 0 ? `${Math.round((summary.failedCalls / summary.totalCalls) * 100)}%` : null,
    },
    {
      title: 'Error Rate',
      value: `${summary.errorRate}%`,
      icon: TrendingUp,
      gradient: summary.errorRate > 10 ? 'from-red-500 to-red-600' : 'from-yellow-500 to-yellow-600',
      bgGradient: summary.errorRate > 10 ? 'from-red-50 to-red-100' : 'from-yellow-50 to-yellow-100',
      iconBg: summary.errorRate > 10 ? 'bg-red-500' : 'bg-yellow-500',
      textColor: summary.errorRate > 10 ? 'text-red-700' : 'text-yellow-700',
      change: summary.errorRate > 5 ? 'High' : summary.errorRate > 1 ? 'Medium' : 'Low',
    },
    {
      title: 'Average Latency',
      value: `${summary.averageLatency}ms`,
      icon: Clock,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-700',
      change: summary.averageLatency > 1000 ? 'Slow' : summary.averageLatency > 500 ? 'Medium' : 'Fast',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative group overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className={`text-sm font-semibold ${card.textColor} mb-2 opacity-80`}>
                {card.title}
              </h3>

              {/* Value */}
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {card.value}
                </p>
                
                {/* Change indicator */}
                {card.change && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/50 ${card.textColor}`}>
                    {card.change}
                  </span>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        );
      })}
    </div>
  );
};