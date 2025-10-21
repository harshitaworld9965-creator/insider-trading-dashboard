import fs from 'fs';
import path from 'path';

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

// Path to your processed data
const DATA_PATH = path.join(process.cwd(), '..', 'data', 'processed', 'smart');

// Simple CSV parser
function parseCSV(csvText: string): CSVRecord[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const result: CSVRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: CSVRecord = {} as CSVRecord;
    
    headers.forEach((header, index) => {
      let value: string | number = values[index] || '';
      
      // The first column is actually the Date, but labeled as "Price"
      if (index === 0 && header === 'Price') {
        // This is actually the date column
        row['Date'] = value;
      }
      // Convert numeric fields (skip the date column)
      else if (value !== '' && header !== 'Date') {
        const numValue = parseFloat(value);
        value = isNaN(numValue) ? value : numValue;
        row[header] = value;
      } else {
        row[header] = value;
      }
    });
    
    result.push(row);
  }
  
  return result;
}

export async function getAvailableStocks(): Promise<string[]> {
  try {
    const files = fs.readdirSync(DATA_PATH);
    return files
      .filter(file => file.endsWith('_smart_anomalies.csv'))
      .map(file => file.replace('_smart_anomalies.csv', ''))
      .sort();
  } catch (error) {
    console.error('Error reading data directory:', error);
    return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'JNJ', 'WMT'];
  }
}

export async function getStockData(ticker: string): Promise<StockData[]> {
  try {
    const filePath = path.join(DATA_PATH, `${ticker}_smart_anomalies.csv`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const records = parseCSV(fileContent);

    return records.map((record: CSVRecord) => ({
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