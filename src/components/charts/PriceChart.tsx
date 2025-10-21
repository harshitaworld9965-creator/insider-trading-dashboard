'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from 'recharts';

interface StockData {
  date: string;
  close: number;
  daily_return: number;
  volume: number;
  volume_ratio_20d: number;
  volatility_5d: number;
  is_smart_anomaly: number;
}

interface PriceChartProps {
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
  anomaly: number | null;
}

// Simple date formatter for YYYY-MM-DD dates
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'Invalid Date';
  
  try {
    // Parse YYYY-MM-DD format
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Format as MM/YY for the chart
    return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
  } catch (error) {
    console.warn('Error formatting date:', dateStr, error);
    return dateStr;
  }
};

export default function PriceChart({ data, ticker }: PriceChartProps) {
  // Prepare data with proper typing
  const chartData: ChartDataPoint[] = data.map(item => ({
    ...item,
    anomaly: item.is_smart_anomaly === 1 ? item.close : null
  }));

  // Fixed tooltip formatter that matches Recharts' expected signature
  const formatTooltipValue = (value: number, name: string): [string, string] => {
    if (value === null || value === undefined) return ['N/A', name];
    
    if (name === 'close' || name === 'Price') {
      return [`$${value.toFixed(2)}`, 'Price'];
    }
    return [value.toFixed(2), name];
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
    <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {ticker} Price with Anomaly Detection
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={formatDate}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => `$${value}`}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={formatTooltipLabel}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={false}
              name="Stock Price"
            />
            <Scatter 
              dataKey="anomaly" 
              fill="#f97316" 
              name="Anomalies"
              r={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}