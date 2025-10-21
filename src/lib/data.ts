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

interface CSVRecord {
  [key: string]: string | number | undefined;
  Date?: string;
  Price?: string;
  Close: number;
  Daily_Return: number;
  Volume: number;
  Volume_Ratio_20d: number;
  Volatility_5d: number;
  Is_Smart_Anomaly: number;
  Anomaly_Score?: number;
}

export async function getAvailableStocks(): Promise<string[]> {
  try {
    // In production, we'll use the pre-built JSON files
    // For now, return the tickers that we know have JSON files
    const defaultStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'JNJ', 'WMT'];
    
    // In a real scenario, you might want to fetch available stocks from an API
    // or maintain a list of available tickers
    return defaultStocks;
  } catch (error) {
    console.error('Error getting available stocks:', error);
    return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'JNJ', 'WMT'];
  }
}

export async function getStockData(ticker: string): Promise<StockData[]> {
  try {
    // Fetch from JSON file in public folder
    const response = await fetch(`/data/${ticker}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`);
    }
    
    const records: CSVRecord[] = await response.json();

    return records.map((record) => ({
      date: record.Date || record.Price || '', // Use Date if available, fallback to Price
      close: record.Close,
      daily_return: record.Daily_Return,
      volume: record.Volume,
      volume_ratio_20d: record.Volume_Ratio_20d,
      volatility_5d: record.Volatility_5d,
      is_smart_anomaly: record.Is_Smart_Anomaly,
      anomaly_score: record.Anomaly_Score
    }));
  } catch (error) {
    console.error(`Error reading data for ${ticker}:`, error);
    return [];
  }
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