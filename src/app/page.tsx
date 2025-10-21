'use client';

import { useState, useEffect } from 'react';
import PriceChart from '@/components/charts/PriceChart';
import VolatilityChart from '@/components/charts/VolatilityChart';
import AnomalySummary from '@/components/charts/AnomalySummary';

interface StockData {
  date: string;
  close: number;
  daily_return: number;
  volume: number;
  volume_ratio_20d: number;
  volatility_5d: number;
  is_smart_anomaly: number;
}

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStockData(selectedStock);
  }, [selectedStock]);

  const loadStockData = async (ticker: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stock/${ticker}`);
      const result = await response.json();
      setStockData(result.data || []);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                🕵️ Insider Trading Detector
              </h1>
              <p className="text-gray-600 mt-1">
                ML-powered anomaly detection in stock trading patterns
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="container mx-auto px-6 py-6">
        <div className="mb-8">
          <div className="flex gap-4 items-center flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Stock
              </label>
              <select 
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="AAPL">Apple (AAPL)</option>
                <option value="MSFT">Microsoft (MSFT)</option>
                <option value="GOOGL">Google (GOOGL)</option>
                <option value="AMZN">Amazon (AMZN)</option>
                <option value="TSLA">Tesla (TSLA)</option>
                <option value="JPM">JPMorgan (JPM)</option>
                <option value="JNJ">Johnson & Johnson (JNJ)</option>
                <option value="WMT">Walmart (WMT)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ML Parameters
              </label>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Contamination: Auto</option>
                  <option>Contamination: 0.1</option>
                  <option>Contamination: 0.05</option>
                </select>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Price Chart */}
            <div className="xl:col-span-2">
              <PriceChart data={stockData} ticker={selectedStock} />
            </div>
            
            {/* Sidebar Charts */}
            <div className="space-y-6">
              <AnomalySummary data={stockData} ticker={selectedStock} />
              <VolatilityChart data={stockData} ticker={selectedStock} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}