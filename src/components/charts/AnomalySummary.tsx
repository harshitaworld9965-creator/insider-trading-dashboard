'use client';

import { TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

interface StockData {
  date: string;
  close: number;
  daily_return: number;
  volume: number;
  volume_ratio_20d: number;
  volatility_5d: number;
  is_smart_anomaly: number;
}

interface AnomalySummaryProps {
  data: StockData[];
  ticker: string;
}

export default function AnomalySummary({ data, ticker }: AnomalySummaryProps) {
  const anomalies = data.filter(d => d.is_smart_anomaly === 1);
  const avgVolatility = data.length > 0 
    ? data.reduce((sum, d) => sum + d.volatility_5d, 0) / data.length 
    : 0;
  const maxReturn = data.length > 0 
    ? Math.max(...data.map(d => Math.abs(d.daily_return))) 
    : 0;
  const highVolumeAnomalies = anomalies.filter(a => a.volume_ratio_20d > 2).length;
  const anomalyRate = data.length > 0 ? (anomalies.length / data.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
  {ticker} Anomaly Summary
</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-gray-700">Total Anomalies</span>
          </div>
          <span className="text-2xl font-bold text-orange-600">
            {anomalies.length}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-gray-700">Avg Volatility</span>
          </div>
          <span className="text-xl font-semibold text-purple-600">
            {avgVolatility.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700">Max Daily Return</span>
          </div>
          <span className="text-xl font-semibold text-blue-600">
            {maxReturn.toFixed(2)}%
          </span>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          <div className="flex justify-between mb-1">
            <span>High volume anomalies:</span>
            <span className="font-medium">{highVolumeAnomalies}</span>
          </div>
          <div className="flex justify-between">
            <span>Anomaly rate:</span>
            <span className="font-medium">{anomalyRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}