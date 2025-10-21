'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockData {
  date: string;
  close: number;
  daily_return: number;
  volume: number;
  volume_ratio_20d: number;
  volatility_5d: number;
  is_smart_anomaly: number;
}

interface VolatilityChartProps {
  data: StockData[];
  ticker: string;
}

interface ChartDataPoint {
  date: string;
  close: number;
  daily_return: number;
  volume: number;
  volume_ratio_20d: number;
  volatility_5d: number;
  is_smart_anomaly: number;
  isAnomaly: boolean;
}

// Simple date formatter for YYYY-MM-DD dates
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'Invalid Date';
  
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
  } catch {
    return dateStr;
  }
};

export default function VolatilityChart({ data, ticker }: VolatilityChartProps) {
  const chartData: ChartDataPoint[] = data.map(item => ({
    ...item,
    isAnomaly: item.is_smart_anomaly === 1
  }));

  // Fixed tooltip formatter - Recharts passes number values
  const formatTooltipValue = (value: number): [string, string] => {
    if (value === null || value === undefined) return ['N/A', 'Volatility'];
    
    return [`${value.toFixed(2)}%`, 'Volatility'];
  };

  const formatYAxis = (value: number): string => {
    return isNaN(value) ? '0%' : `${value.toFixed(1)}%`;
  };

  const formatTooltipLabel = (label: string | number): string => {
    try {
      const dateStr = String(label);
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString();
    } catch {
      return String(label);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {ticker} Volatility Trend
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickFormatter={formatDate}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={formatTooltipLabel}
            />
            <Area 
              type="monotone" 
              dataKey="volatility_5d" 
              stroke="#f97316" 
              fill="#fed7aa"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}