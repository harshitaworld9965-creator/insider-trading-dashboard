import { NextResponse } from 'next/server';
import { getAvailableStocks, getStockSummary } from '@/lib/data';

export async function GET() {
  try {
    const stocks = await getAvailableStocks();
    const summaries = await Promise.all(
      stocks.map(ticker => getStockSummary(ticker))
    );
    
    return NextResponse.json({ stocks: summaries });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
