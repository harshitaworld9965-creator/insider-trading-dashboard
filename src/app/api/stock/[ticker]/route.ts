import { NextResponse } from 'next/server';
import { getStockData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }  // ← Add Promise<>
) {
  try {
    const { ticker } = await params;  // ← Add 'await' here
    const data = await getStockData(ticker);
    
    return NextResponse.json({ ticker, data });
  } catch (_error) {
    const { ticker } = await params;  // ← Also add 'await' in catch block
    return NextResponse.json(
      { error: `Failed to fetch data for ${ticker}` },
      { status: 500 }
    );
  }
}