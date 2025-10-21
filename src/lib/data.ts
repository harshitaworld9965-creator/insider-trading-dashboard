// Types for our data
export interface StockData {
  date: string;
  close: number;
  daily_return: number;
  volume: number;
  volume_ratio_20d: number;
  volatility_5d: number;
  is_smart_anomaly: number;
  anomaly_score?: number;
}

export interface StockSummary {
  ticker: string;
  totalDays: number;
  anomalyCount: number;
  avgVolatility: number;
  maxReturn: number;
  recentAnomalies: StockData[];
}

interface JSONRecord {
  Date?: string;
  Price?: string;
  Close?: number;
  close?: number;
  Daily_Return?: number;
  daily_return?: number;
  Volume?: number;
  volume?: number;
  Volume_Ratio_20d?: number;
  volume_ratio_20d?: number;
  Volatility_5d?: number;
  volatility_5d?: number;
  Is_Smart_Anomaly?: number;
  is_smart_anomaly?: number;
  Anomaly_Score?: number;
  anomaly_score?: number;
  [key: string]: string | number | undefined;
}

export async function getAvailableStocks(): Promise<string[]> {
  return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'JNJ', 'WMT'];
}

export async function getStockData(ticker: string): Promise<StockData[]> {
  try {
    console.log(`Fetching data for ${ticker}...`);
    
    // Fetch from JSON file in public folder
    const response = await fetch(`/data/${ticker}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const records: JSONRecord[] = await response.json();
    console.log(`Received ${records.length} records for ${ticker}`);

    // Transform the data - handle different possible field names
    const transformedData = records.map((record: JSONRecord) => {
  const dateValue = record.Date || record.Price;
  const firstKey = Object.keys(record)[0];
  const finalDateValue = dateValue || (record[firstKey] as string) || 'Unknown Date';

  return {
    date: finalDateValue,
    close: Number(record.Close || record.close || 0),
    daily_return: Number(record.Daily_Return || record.daily_return || 0),
    volume: Number(record.Volume || record.volume || 0),
    volume_ratio_20d: Number(record.Volume_Ratio_20d || record.volume_ratio_20d || 0),
    volatility_5d: Number(record.Volatility_5d || record.volatility_5d || 0),
    is_smart_anomaly: Number(record.Is_Smart_Anomaly || record.is_smart_anomaly || 0),
    anomaly_score: record.Anomaly_Score || record.anomaly_score ? Number(record.Anomaly_Score || record.anomaly_score) : undefined
  };
});


    console.log(`Transformed ${transformedData.length} records for ${ticker}`);
    return transformedData;

  } catch (error) {
    console.error(`Error reading data for ${ticker}:`, error);
    // Return mock data as fallback
    return getMockData();
  }
}

// Fallback mock data
function getMockData(): StockData[] {
  return [
    {
      date: "2024-01-01",
      close: 150 + Math.random() * 50,
      daily_return: Math.random() * 10 - 5,
      volume: 1000000,
      volume_ratio_20d: 1.2,
      volatility_5d: 2.1,
      is_smart_anomaly: 0
    },
    {
      date: "2024-01-02", 
      close: 155 + Math.random() * 50,
      daily_return: Math.random() * 10 - 5,
      volume: 1200000,
      volume_ratio_20d: 1.8,
      volatility_5d: 2.8,
      is_smart_anomaly: 1
    }
  ];
}

export async function getStockSummary(ticker: string): Promise<StockSummary> {
  const data = await getStockData(ticker);
  const anomalies = data.filter(d => d.is_smart_anomaly === 1);
  const avgVolatility = data.length > 0 
    ? data.reduce((sum, d) => sum + d.volatility_5d, 0) / data.length 
    : 0;
  const maxReturn = data.length > 0 
    ? Math.max(...data.map(d => Math.abs(d.daily_return))) 
    : 0;
  
  return {
    ticker,
    totalDays: data.length,
    anomalyCount: anomalies.length,
    avgVolatility,
    maxReturn,
    recentAnomalies: anomalies.slice(-5)
  };
}